'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Campaign {
  id: string;
  title: string;
}

const DISMISS_KEY = 'final_dismissed_campaign';

export default function CampaignBar() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [visible, setVisible]   = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from('campaigns')
      .select('id, title')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        // Stay hidden if user already dismissed this exact campaign
        if (sessionStorage.getItem(DISMISS_KEY) === data.id) return;
        setCampaign(data);
        setVisible(true);
      });
  }, []);

  const dismiss = () => {
    if (campaign) sessionStorage.setItem(DISMISS_KEY, campaign.id);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && campaign && (
        <motion.div
          key={campaign.id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="relative bg-gold/95 px-10 py-2.5 flex items-center justify-center">
            <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase text-charcoal text-center leading-relaxed">
              {campaign.title}
            </p>
            <button
              onClick={dismiss}
              aria-label="Kapat"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded text-charcoal/50 hover:text-charcoal transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
