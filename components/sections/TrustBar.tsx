'use client';

import { motion } from 'framer-motion';
import { Truck, Shield, Headphones, CreditCard } from 'lucide-react';

const trustItems = [
  { icon: Truck, title: 'Ücretsiz Kargo', desc: '5.000 ₺ üzeri siparişlerde' },
  { icon: Shield, title: '5 Yıl Garanti', desc: 'Tüm ürünlerde garanti' },
  { icon: Headphones, title: '7/24 Destek', desc: 'Her zaman yanınızdayız' },
  { icon: CreditCard, title: 'Güvenli Alışveriş', desc: 'Korumalı ödeme sistemi' },
];

export default function TrustBar() {
  return (
    <section className="py-12 bg-cream border-y border-stone/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="p-3 bg-gold/10 rounded-xl flex-shrink-0">
                <item.icon className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-charcoal">{item.title}</h3>
                <p className="text-xs text-brown/50">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
