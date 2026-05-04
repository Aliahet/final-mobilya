'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface CustomerAnalytics {
  user_id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  total_orders: number;
  total_spent: number;
  avg_order_value: number;
  last_order_at: string;
  first_order_at: string;
}

/**
 * Fetches customer spending analytics via secure admin-only RPC.
 * The RPC `admin_get_customer_spending` is a SECURITY DEFINER function
 * that verifies the caller has admin role before returning data.
 */
export function useCustomerAnalytics(limit = 20) {
  const [customers, setCustomers] = useState<CustomerAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchData = async () => {
      // Use secure RPC instead of querying the view directly
      const { data, error } = await supabase
        .rpc('admin_get_customer_spending', { p_limit: limit });

      if (error) {
        setError(error.message);
      } else {
        setCustomers((data || []) as CustomerAnalytics[]);
      }
      setLoading(false);
    };

    fetchData();
  }, [limit]);

  return { customers, loading, error };
}
