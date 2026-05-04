'use client';

import { categories } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionLabel from '@/components/ui/SectionLabel';
import { useLang } from '@/lib/i18n';

export default function KategoriContent() {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-cream">
      {/* Page Hero */}
      <div className="bg-beige border-b border-stone">
        <div className="container-px py-16 md:py-20">
          <AnimatedSection>
            <SectionLabel text={t.categoryPage.allLabel} className="mb-4" />
            <h1 className="heading-1 text-charcoal">
              {t.categoryPage.allHeading}{' '}
              <em className="not-italic text-gold">{t.categoryPage.allHeadingAccent}</em>
            </h1>
            <p className="text-brown mt-4 max-w-lg text-sm leading-relaxed">
              {t.categoryPage.allDesc}
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Category Grid */}
      <div className="container-px section-py">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <AnimatedSection key={cat.id} delay={i * 0.07}>
              <Link href={`/kategori/${cat.slug}`} className="group block">
                <div className="relative h-72 overflow-hidden bg-beige mb-4">
                  <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-105">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="badge-gold">{cat.count} {t.categoryPage.products}</span>
                  </div>
                </div>
                <div>
                  <h2 className="font-serif text-xl text-charcoal group-hover:text-gold transition-colors duration-200">
                    {cat.name}
                  </h2>
                  <p className="text-sm text-sand mt-1">{cat.description}</p>
                  <p className="mt-3 text-xs font-semibold tracking-widest uppercase text-gold group-hover:gap-2 transition-all flex items-center gap-1">
                    {t.categoryPage.explore} <span>→</span>
                  </p>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}
