import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Product, Category } from '@/lib/types';
import ProductsClient from './ProductsClient';

export const metadata = {
  title: 'Ürünler',
  description: 'Final Mobilya premium mobilya koleksiyonu. Oturma grubu, yatak odası, yemek odası ve daha fazlası.',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { kategori?: string; siralama?: string; arama?: string };
}) {
  const supabase = createServerSupabaseClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');

  // Build product query
  let query = supabase
    .from('products')
    .select('*, category:categories(*), variants:product_variants(*)')
    .eq('is_active', true);

  if (searchParams.kategori) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', searchParams.kategori)
      .single();
    if (cat) {
      query = query.eq('category_id', cat.id);
    }
  }

  if (searchParams.arama) {
    query = query.or(`name.ilike.%${searchParams.arama}%,description.ilike.%${searchParams.arama}%`);
  }

  // Sort
  switch (searchParams.siralama) {
    case 'fiyat-artan':
      query = query.order('base_price', { ascending: true });
      break;
    case 'fiyat-azalan':
      query = query.order('base_price', { ascending: false });
      break;
    case 'yeni':
      query = query.order('created_at', { ascending: false });
      break;
    default:
      query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
  }

  const { data: products } = await query;

  return (
    <ProductsClient
      products={(products as Product[]) || []}
      categories={(categories as Category[]) || []}
      activeCategory={searchParams.kategori || null}
      activeSort={searchParams.siralama || null}
      searchQuery={searchParams.arama || null}
    />
  );
}
