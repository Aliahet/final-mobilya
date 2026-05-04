'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Product, Category } from '@/lib/types';
import { formatPrice } from '@/lib/data';
import ProductCard from '@/components/product/ProductCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionLabel from '@/components/ui/SectionLabel';
import { useLang } from '@/lib/i18n';

interface Props {
  category: Category;
  products: Product[];
}

export default function CategoryClientPage({ category, products }: Props) {
  const [sort, setSort] = useState('default');
  const [filterOpen, setFilterOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [sortDropdown, setSortDropdown] = useState(false);
  const { t } = useLang();

  const sortOptions = t.categoryPage.sortOptions;

  const allVariants = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.variants?.forEach((v) => set.add(v.name)));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (maxPrice < 50000) result = result.filter((p) => (p.discount_price ?? p.base_price) <= maxPrice);
    if (selectedVariants.length) result = result.filter((p) => p.variants?.some((v) => selectedVariants.includes(v.name)));

    switch (sort) {
      case 'price-asc': result.sort((a, b) => (a.discount_price ?? a.base_price) - (b.discount_price ?? b.base_price)); break;
      case 'price-desc': result.sort((a, b) => (b.discount_price ?? b.base_price) - (a.discount_price ?? a.base_price)); break;
      case 'new': result = result.filter((p) => p.is_featured).concat(result.filter((p) => !p.is_featured)); break;
    }
    return result;
  }, [products, maxPrice, selectedVariants, sort]);

  const toggleVariant = (v: string) =>
    setSelectedVariants((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  const activeFilterCount = selectedVariants.length + (maxPrice < 50000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-cream">
      {/* Breadcrumb + Header */}
      <div className="bg-beige border-b border-stone">
        <div className="container-px py-5">
          <nav className="text-xs text-sand flex items-center gap-2 mb-4">
            <Link href="/" className="hover:text-charcoal transition-colors">{t.breadcrumb.home}</Link>
            <span>/</span>
            <Link href="/kategori" className="hover:text-charcoal transition-colors">{t.breadcrumb.categories}</Link>
            <span>/</span>
            <span className="text-charcoal">{category.name}</span>
          </nav>
          <AnimatedSection>
            <SectionLabel text={t.categoryPage.label(filtered.length)} className="mb-3" />
            <h1 className="heading-1 text-charcoal">{category.name}</h1>
            <p className="text-brown text-sm mt-2 max-w-xl">{category.description}</p>
          </AnimatedSection>
        </div>
      </div>

      <div className="container-px py-8 flex gap-8">
        {/* Sidebar Filter — Desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-24 self-start">
          <FilterPanel
            maxPrice={maxPrice} setMaxPrice={setMaxPrice}
            allVariants={allVariants} selectedVariants={selectedVariants} toggleVariant={toggleVariant}
          />
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <button
              onClick={() => setFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-stone px-4 py-2.5 text-sm text-charcoal hover:border-charcoal transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t.categoryPage.filter}
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-gold text-white text-xs font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3 ml-auto">
              {activeFilterCount > 0 && (
                <button
                  onClick={() => { setSelectedVariants([]); setMaxPrice(50000); }}
                  className="text-xs text-sand hover:text-brown flex items-center gap-1 transition-colors"
                >
                  <X className="w-3 h-3" /> {t.categoryPage.clearFilters}
                </button>
              )}
              {/* Sort */}
              <div className="relative">
                <button
                  onClick={() => setSortDropdown(!sortDropdown)}
                  className="flex items-center gap-2 border border-stone px-4 py-2.5 text-sm text-charcoal hover:border-charcoal transition-colors"
                >
                  {sortOptions.find((o) => o.value === sort)?.label || t.categoryPage.sortOptions[0].label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortDropdown ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {sortDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 w-52 bg-cream border border-stone shadow-menu z-20"
                    >
                      {sortOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setSort(opt.value); setSortDropdown(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            sort === opt.value ? 'text-gold bg-beige' : 'text-brown hover:bg-beige hover:text-charcoal'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Product grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-xl text-charcoal mb-3">{t.categoryPage.noResults}</p>
              <p className="text-sm text-brown">{t.categoryPage.noResultsDesc}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm lg:hidden"
              onClick={() => setFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', ease: [0.25, 0.1, 0.25, 1], duration: 0.35 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-cream z-50 overflow-y-auto shadow-modal"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-stone">
                <span className="font-serif text-lg">{t.categoryPage.filter}</span>
                <button onClick={() => setFilterOpen(false)}>
                  <X className="w-5 h-5 text-brown" />
                </button>
              </div>
              <div className="p-6">
                <FilterPanel
                  maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                  allVariants={allVariants} selectedVariants={selectedVariants} toggleVariant={toggleVariant}
                />
              </div>
              <div className="p-6 border-t border-stone">
                <button onClick={() => setFilterOpen(false)} className="btn-primary w-full">
                  {t.categoryPage.applyFilters(filtered.length)}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterPanel({
  maxPrice, setMaxPrice,
  allVariants, selectedVariants, toggleVariant,
}: {
  maxPrice: number; setMaxPrice: (v: number) => void;
  allVariants: string[]; selectedVariants: string[]; toggleVariant: (c: string) => void;
}) {
  const { t } = useLang();

  return (
    <div className="space-y-8">
      {/* Price */}
      <div>
        <h3 className="label-md text-charcoal mb-4">{t.categoryPage.priceRange}</h3>
        <input
          type="range"
          min={1000}
          max={50000}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-gold cursor-pointer"
        />
        <div className="flex justify-between mt-2 text-xs text-sand">
          <span>1.000 ₺</span>
          <span>{maxPrice >= 50000 ? t.categoryPage.priceAll : formatPrice(maxPrice)}</span>
        </div>
      </div>

      {/* Variants (replaces Materials/Colors) */}
      {allVariants.length > 0 && (
        <div>
          <h3 className="label-md text-charcoal mb-4">Seçenekler</h3>
          <div className="space-y-2">
            {allVariants.map((v) => (
              <label key={v} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedVariants.includes(v)}
                  onChange={() => toggleVariant(v)}
                  className="accent-gold w-4 h-4 cursor-pointer"
                />
                <span className={`text-sm transition-colors ${selectedVariants.includes(v) ? 'text-charcoal font-medium' : 'text-brown group-hover:text-charcoal'}`}>
                  {v}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
