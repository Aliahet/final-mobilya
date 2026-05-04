'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  order_count: number;
  gross_revenue: number;
  total_discounts: number;
  shipping_revenue: number;
}

export interface RevenueData {
  monthly: MonthlyRevenue[];
  currentMonth: MonthlyRevenue | null;
  previousMonth: MonthlyRevenue | null;
  percentageChange: number | null;
  totalRevenue: number;
  totalOrders: number;
  loading: boolean;
  error: string | null;
}

/**
 * Fetches monthly revenue data via secure admin-only RPC.
 * The RPC `admin_get_monthly_revenue` is a SECURITY DEFINER function
 * that verifies the caller has admin role before returning data.
 * This prevents any non-admin user from accessing revenue data.
 */
export function useRevenueData() {
  const [data, setData] = useState<RevenueData>({
    monthly: [],
    currentMonth: null,
    previousMonth: null,
    percentageChange: null,
    totalRevenue: 0,
    totalOrders: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const supabase = createClient();

    const fetchData = async () => {
      // Use secure RPC instead of querying the view directly
      const { data: rows, error } = await supabase
        .rpc('admin_get_monthly_revenue');

      if (error) {
        setData(prev => ({ ...prev, loading: false, error: error.message }));
        return;
      }

      const monthly = (rows || []) as MonthlyRevenue[];
      const currentMonth = monthly[monthly.length - 1] ?? null;
      const previousMonth = monthly[monthly.length - 2] ?? null;

      let percentageChange: number | null = null;
      if (currentMonth && previousMonth && Number(previousMonth.revenue) > 0) {
        percentageChange =
          ((Number(currentMonth.revenue) - Number(previousMonth.revenue)) /
            Number(previousMonth.revenue)) *
          100;
      }

      setData({
        monthly,
        currentMonth,
        previousMonth,
        percentageChange,
        totalRevenue: monthly.reduce((s, r) => s + Number(r.revenue), 0),
        totalOrders: monthly.reduce((s, r) => s + Number(r.order_count), 0),
        loading: false,
        error: null,
      });
    };

    fetchData();
  }, []);

  return data;
}
