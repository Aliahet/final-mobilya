'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, X, Loader2, Upload, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Product, Category } from '@/lib/types';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(price);
}

const emptyProduct = {
  name: '', slug: '', description: '', short_description: '',
  category_id: '', base_price: 0, discount_price: null as number | null,
  is_active: true, is_featured: false, stock_quantity: 0, sku: '',
  images: [] as string[], tags: [] as string[], specifications: {} as Record<string, string>,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const supabase = createClient();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const [prodRes, catRes] = await Promise.all([
      supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    setProducts((prodRes.data as Product[]) || []);
    setCategories((catRes.data as Category[]) || []);
    setLoading(false);
  };

  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyProduct);
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      short_description: product.short_description || '',
      category_id: product.category_id || '',
      base_price: product.base_price,
      discount_price: product.discount_price,
      is_active: product.is_active,
      is_featured: product.is_featured,
      stock_quantity: product.stock_quantity,
      sku: product.sku || '',
      images: product.images || [],
      tags: product.tags || [],
      specifications: product.specifications || {},
    });
    setShowForm(true);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploadingImage(true);

    try {
      const newImages = [...form.images];
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop();
        const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from('product-images').upload(path, file);
        if (!error) {
          const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path);
          newImages.push(publicUrl);
        }
      }
      setForm({ ...form, images: newImages });
    } catch (err) {
      console.error('Upload error:', err);
    }
    setUploadingImage(false);
  };

  const removeImage = (index: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  const addSpec = () => {
    if (specKey && specValue) {
      setForm({ ...form, specifications: { ...form.specifications, [specKey]: specValue } });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpec = (key: string) => {
    const specs = { ...form.specifications };
    delete specs[key];
    setForm({ ...form, specifications: specs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const productData = {
      name: form.name,
      slug: form.slug || generateSlug(form.name),
      description: form.description,
      short_description: form.short_description,
      category_id: form.category_id || null,
      base_price: form.base_price,
      discount_price: form.discount_price || null,
      is_active: form.is_active,
      is_featured: form.is_featured,
      stock_quantity: form.stock_quantity,
      sku: form.sku || null,
      images: form.images,
      tags: form.tags,
      specifications: form.specifications,
    };

    if (editingProduct) {
      await supabase.from('products').update(productData).eq('id', editingProduct.id);
    } else {
      await supabase.from('products').insert(productData);
    }

    setSaving(false);
    setShowForm(false);
    fetchData();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchData();
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="text-center py-20 text-brown/40">Yükleniyor...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-charcoal">Ürün Yönetimi</h1>
          <p className="text-sm text-brown/50 mt-1">{products.length} ürün</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-charcoal text-white text-sm font-medium rounded-xl hover:bg-gold transition-colors">
          <Plus className="w-4 h-4" /> Yeni Ürün
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/30" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ürün ara..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-brown/50 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">Ürün</th>
                <th className="px-6 py-3">Kategori</th>
                <th className="px-6 py-3">Fiyat</th>
                <th className="px-6 py-3">Stok</th>
                <th className="px-6 py-3">Durum</th>
                <th className="px-6 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.images?.[0] && <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="48px" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-charcoal">{product.name}</p>
                        <p className="text-xs text-brown/40">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-brown/60">{product.category?.name || '-'}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-charcoal font-medium">{formatPrice(product.discount_price ?? product.base_price)}</p>
                      {product.discount_price && <p className="text-xs text-brown/40 line-through">{formatPrice(product.base_price)}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${product.stock_quantity <= 5 ? 'text-red-500' : 'text-charcoal'}`}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      product.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {product.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(product)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-20 px-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-2xl shadow-modal mb-20">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-serif text-xl text-charcoal">{editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-charcoal mb-1">Ürün Adı</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-charcoal mb-1">URL Slug</label>
                    <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold/40" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Kategori</label>
                    <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40">
                      <option value="">Seçiniz</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">SKU</label>
                    <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Kısa Açıklama</label>
                  <input type="text" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Detaylı Açıklama</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-none" />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Fiyat (₺)</label>
                    <input type="number" required min="0" step="0.01" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">İndirimli (₺)</label>
                    <input type="number" min="0" step="0.01" value={form.discount_price ?? ''} onChange={(e) => setForm({ ...form, discount_price: e.target.value ? parseFloat(e.target.value) : null })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" placeholder="Opsiyonel" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Stok</label>
                    <input type="number" required min="0" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" />
                    Aktif
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded" />
                    Öne Çıkan
                  </label>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Görseller</label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                        <Image src={img} alt={`Image ${i}`} fill className="object-cover" sizes="80px" />
                        <button type="button" onClick={() => removeImage(i)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                    <label className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-gold transition-colors">
                      {uploadingImage ? <Loader2 className="w-5 h-5 animate-spin text-brown/30" /> : <Upload className="w-5 h-5 text-brown/30" />}
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Specifications */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Teknik Özellikler</label>
                  {Object.entries(form.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-brown/60 flex-1">{key}: {value}</span>
                      <button type="button" onClick={() => removeSpec(key)} className="text-red-400 hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input type="text" value={specKey} onChange={(e) => setSpecKey(e.target.value)} placeholder="Özellik adı"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
                    <input type="text" value={specValue} onChange={(e) => setSpecValue(e.target.value)} placeholder="Değer"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
                    <button type="button" onClick={addSpec} className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                    İptal
                  </button>
                  <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3 bg-charcoal text-white rounded-xl text-sm hover:bg-gold disabled:opacity-50 transition-colors">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> {editingProduct ? 'Güncelle' : 'Kaydet'}</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
