'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Grid3X3, LayoutList } from 'lucide-react';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/product/ProductCard';

interface Props {
  products: Product[];
  categories: Category[];
  activeCategory: string | null;
  activeSort: string | null;
  searchQuery: string | null;
}

const sortOptions = [
  { value: '', label: 'Önerilen' },
  { value: 'yeni', label: 'En Yeni' },
  { value: 'fiyat-artan', label: 'Fiyat: Düşükten Yükseğe' },
  { value: 'fiyat-azalan', label: 'Fiyat: Yüksekten Düşüğe' },
];

export default function ProductsClient({ products, categories, activeCategory, activeSort, searchQuery }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(searchQuery || '');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/urunler?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams('arama', search);
  };

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-serif text-display-sm text-charcoal mb-2">Ürünlerimiz</h1>
          <p className="text-brown/60 text-sm">
            {products.length} ürün bulundu
            {activeCategory && ` — ${categories.find(c => c.slug === activeCategory)?.name}`}
          </p>
        </motion.div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ürün ara..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-stone/40 rounded-xl text-charcoal placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all text-sm"
            />
          </form>

          <div className="flex gap-3">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all ${
                showFilters ? 'bg-charcoal text-white border-charcoal' : 'bg-white border-stone/40 text-charcoal hover:border-gold/60'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtrele
            </button>

            {/* Sort */}
            <select
              value={activeSort || ''}
              onChange={(e) => updateParams('siralama', e.target.value)}
              className="px-4 py-3 bg-white border border-stone/40 rounded-xl text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* View Mode */}
            <div className="hidden sm:flex bg-white border border-stone/40 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-3 transition-colors ${viewMode === 'grid' ? 'bg-charcoal text-white' : 'text-brown/50 hover:text-charcoal'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-3 transition-colors ${viewMode === 'list' ? 'bg-charcoal text-white' : 'text-brown/50 hover:text-charcoal'}`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white rounded-2xl border border-stone/30 p-6">
                <h3 className="text-sm font-medium text-charcoal mb-4">Kategoriler</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateParams('kategori', '')}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      !activeCategory ? 'bg-charcoal text-white' : 'bg-cream border border-stone/40 text-brown hover:border-gold/60'
                    }`}
                  >
                    Tümü
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateParams('kategori', cat.slug)}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        activeCategory === cat.slug ? 'bg-charcoal text-white' : 'bg-cream border border-stone/40 text-brown hover:border-gold/60'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters */}
        {(activeCategory || searchQuery) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 text-gold rounded-full text-sm">
                {categories.find(c => c.slug === activeCategory)?.name}
                <button onClick={() => updateParams('kategori', '')}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 text-gold rounded-full text-sm">
                &quot;{searchQuery}&quot;
                <button onClick={() => { setSearch(''); updateParams('arama', ''); }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-brown/50 text-lg">Ürün bulunamadı.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <ProductCard product={product} viewMode={viewMode} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
