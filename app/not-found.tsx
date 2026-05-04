'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';

export default function NotFound() {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <p className="font-serif text-8xl text-stone font-light mb-6">404</p>
        <h1 className="heading-2 text-charcoal mb-4">{t.notFound.heading}</h1>
        <p className="text-brown text-sm leading-relaxed mb-8">{t.notFound.desc}</p>
        <Link href="/" className="btn-primary inline-flex">
          {t.notFound.cta}
        </Link>
      </div>
    </div>
  );
}
