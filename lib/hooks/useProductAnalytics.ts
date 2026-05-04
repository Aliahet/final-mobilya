'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface ProductAnalytics {
  product_id: string;
  product_name: string;
  sku: string | null;
  total_units_sold: number;
  total_revenue: number;
  order_count: number;
  avg_unit_price: number;
}

/**
 * Fetches product analytics data via secure admin-only RPC.
 * The RPC `admin_get_top_products` is a SECURITY DEFINER function
 * that verifies the caller has admin role before returning data.
 */
export function useProductAnalytics(limit = 10) {
  const [products, setProducts] = useState<ProductAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchData = async () => {
      // Use secure RPC instead of querying the view directly
      const { data, error } = await supabase
        .rpc('admin_get_top_products', { p_limit: limit });

      if (error) {
        setError(error.message);
      } else {
        setProducts((data || []) as ProductAnalytics[]);
      }
      setLoading(false);
    };

    fetchData();
  }, [limit]);

  return { products, loading, error };
}
