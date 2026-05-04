'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Store {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  map_url: string | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45 } }),
};

export default function SubelerimizPage() {
  const [stores, setStores]       = useState<Store[]>([]);
  const [loading, setLoading]     = useState(true);
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => {
    const supabase = createClient();

    const fetchStores = async () => {
      const { data } = await supabase
        .from('stores')
        .select('id, name, city, address, phone, map_url')
        .eq('is_active', true)
        .order('sort_order');
      setStores((data as Store[]) ?? []);
      setLoading(false);
    };

    fetchStores();

    const channel = supabase
      .channel('stores-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stores' }, () => {
        fetchStores();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const cities = [...new Set(stores.map(s => s.city))].sort();
  const filtered = cityFilter ? stores.filter(s => s.city === cityFilter) : stores;

  return (
    <div className="bg-cream min-h-screen">

      {/* ── Hero ── */}
      <section className="bg-charcoal py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold mb-4"
          >
            Mağazalarımız
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
            className="font-serif text-4xl sm:text-5xl text-cream mb-4"
          >
            Şubelerimiz
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
            className="text-stone/55 text-base max-w-md mx-auto"
          >
            Size en yakın FINAL MOBİLYA mağazasını bulun, deneyim yaşayın.
          </motion.p>
        </div>
      </section>

      {/* ── City Filter ── */}
      {cities.length > 1 && (
        <div className="sticky top-[69px] z-30 bg-cream/95 backdrop-blur-md border-b border-stone/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setCityFilter('')}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                !cityFilter ? 'bg-charcoal text-cream' : 'bg-white border border-stone/30 text-charcoal hover:border-charcoal'
              }`}
            >
              Tümü
            </button>
            {cities.map(city => (
              <button
                key={city}
                onClick={() => setCityFilter(city === cityFilter ? '' : city)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  cityFilter === city ? 'bg-charcoal text-cream' : 'bg-white border border-stone/30 text-charcoal hover:border-charcoal'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Store Cards ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-stone/20 overflow-hidden animate-pulse">
                <div className="h-52 bg-stone/10" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-stone/10 rounded w-3/4" />
                  <div className="h-3 bg-stone/10 rounded w-full" />
                  <div className="h-3 bg-stone/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Search className="w-10 h-10 text-brown/20 mx-auto mb-3" />
            <p className="text-brown/40 text-sm">Bu şehirde şube bulunamadı.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((store, i) => (
              <motion.div
                key={store.id}
                custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={fadeUp}
                className="bg-white rounded-2xl border border-stone/20 overflow-hidden shadow-card hover:shadow-menu transition-shadow duration-300 flex flex-col"
              >
                {/* Map embed */}
                <div className="relative h-52 bg-stone/10">
                  {store.map_url ? (
                    <iframe
                      src={store.map_url}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-brown/20" />
                    </div>
                  )}
                  {/* City badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-charcoal/80 backdrop-blur-sm text-cream text-[10px] font-semibold tracking-wider rounded-full">
                    {store.city}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <h3 className="font-serif text-base text-charcoal leading-snug">{store.name}</h3>

                  <div className="flex items-start gap-2 text-sm text-brown/60">
                    <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{store.address}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-brown/60">
                    <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                    <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="hover:text-charcoal transition-colors">
                      {store.phone}
                    </a>
                  </div>

                  <a
                    href={store.map_url?.replace('/embed?', '/search?') ?? `https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto pt-3 border-t border-stone/20 text-xs font-medium text-gold hover:text-charcoal transition-colors flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Yol Tarifi Al
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
