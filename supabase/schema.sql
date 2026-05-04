-- ============================================================
-- NOKTA EV & YAŞAM — Full Database Schema
-- Run this once in: Supabase Dashboard > SQL Editor
-- Safe to re-run (idempotent).
-- ============================================================


-- ============================================================
-- SECTION 1: PROFILES TABLE
-- Mirrors lib/types.ts Profile interface exactly.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text        NOT NULL,
  full_name   text,
  phone       text,
  role        text        NOT NULL DEFAULT 'customer'
                          CHECK (role IN ('admin', 'customer')),
  avatar_url  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);


-- ============================================================
-- SECTION 2: SHARED HELPER FUNCTIONS
-- ============================================================

-- Auto-stamp updated_at on any table that uses it
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- is_admin() — SECURITY DEFINER so it runs as postgres (superuser),
-- bypassing RLS on profiles. This prevents infinite recursion when
-- the function is called from within a profiles RLS policy.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;


-- ============================================================
-- SECTION 3: AUTO-CREATE PROFILE ON SIGNUP
--
-- WHY SECURITY DEFINER: RLS is enabled on profiles. Without
-- SECURITY DEFINER the trigger would run as the calling role
-- ('authenticated' or 'anon') which has no INSERT policy —
-- every signup would silently fail to create a profile row.
--
-- WHY SET search_path = public: Prevents search_path injection
-- attacks on SECURITY DEFINER functions (Supabase best practice).
--
-- WHY ON CONFLICT DO NOTHING: Handles edge cases like OAuth
-- re-auth where auth.users gets a new insert for an existing id.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'full_name', '')), ''),
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop and recreate to ensure the function body is current
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger for profiles
DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- SECTION 4: RLS POLICIES — PROFILES
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all"  ON public.profiles;

-- Each authenticated user can read their own row
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Each authenticated user can update their own row.
-- Role changes are blocked at the application layer (admin panel only).
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING  (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins (role = 'admin') bypass all restrictions.
-- is_admin() is SECURITY DEFINER — no RLS recursion risk.
CREATE POLICY "profiles_admin_all"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING  (public.is_admin())
  WITH CHECK (public.is_admin());


-- ============================================================
-- SECTION 5: ORDERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.orders (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status               text        NOT NULL DEFAULT 'pending'
                                   CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  total_price          numeric     NOT NULL DEFAULT 0,
  subtotal             numeric     NOT NULL DEFAULT 0,
  shipping_cost        numeric     NOT NULL DEFAULT 0,
  discount_amount      numeric     NOT NULL DEFAULT 0,
  currency             text        NOT NULL DEFAULT 'TRY',
  shipping_name        text        NOT NULL DEFAULT '',
  shipping_address     text        NOT NULL DEFAULT '',
  shipping_city        text        NOT NULL DEFAULT '',
  shipping_district    text,
  shipping_postal_code text,
  shipping_phone       text        NOT NULL DEFAULT '',
  payment_method       text,
  payment_status       text        NOT NULL DEFAULT 'awaiting'
                                   CHECK (payment_status IN ('awaiting','pending','paid','failed','refunded')),
  payment_reference    text,
  payment_data         jsonb       NOT NULL DEFAULT '{}',
  customer_note        text,
  admin_note           text,
  tracking_number      text,
  shipped_at           timestamptz,
  delivered_at         timestamptz,
  cancelled_at         timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS orders_set_updated_at ON public.orders;

CREATE TRIGGER orders_set_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_select_own" ON public.orders;
DROP POLICY IF EXISTS "orders_insert_own" ON public.orders;
DROP POLICY IF EXISTS "orders_admin_all"  ON public.orders;

-- Users see only their own orders
CREATE POLICY "orders_select_own"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can place orders for themselves (checkout flow)
CREATE POLICY "orders_insert_own"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins have full access (update status, add notes, etc.)
CREATE POLICY "orders_admin_all"
  ON public.orders
  FOR ALL
  TO authenticated
  USING  (public.is_admin())
  WITH CHECK (public.is_admin());


-- ============================================================
-- SECTION 6: ORDER ITEMS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.order_items (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     uuid        NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id   uuid        NOT NULL,
  variant_id   uuid,
  product_name text        NOT NULL,
  variant_name text,
  quantity     integer     NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price   numeric     NOT NULL,
  total_price  numeric     NOT NULL,
  image_url    text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "order_items_select_own" ON public.order_items;
DROP POLICY IF EXISTS "order_items_insert_own" ON public.order_items;
DROP POLICY IF EXISTS "order_items_admin_all"  ON public.order_items;

-- Users can read items that belong to their own orders
CREATE POLICY "order_items_select_own"
  ON public.order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- Users can insert items into their own orders
CREATE POLICY "order_items_insert_own"
  ON public.order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- Admins have full access
CREATE POLICY "order_items_admin_all"
  ON public.order_items
  FOR ALL
  TO authenticated
  USING  (public.is_admin())
  WITH CHECK (public.is_admin());


-- ============================================================
-- SECTION 7: BACKFILL EXISTING AUTH USERS
--
-- If there are already users in auth.users from failed signup
-- attempts (auth user created but profile insert never ran),
-- this fills in the missing rows.
-- ============================================================

INSERT INTO public.profiles (id, email, full_name, role)
SELECT
  id,
  email,
  NULLIF(TRIM(COALESCE(raw_user_meta_data->>'full_name', '')), ''),
  'customer'
FROM auth.users
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- SECTION 8: GRANT DATA API ACCESS
--
-- Supabase's PostgREST (Data API) requires explicit GRANT on
-- new tables. Without this, queries from the browser client
-- return "relation does not exist" even with correct RLS.
-- ============================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT, UPDATE ON public.profiles    TO authenticated;
GRANT SELECT, INSERT ON public.orders      TO authenticated;
GRANT SELECT, INSERT ON public.order_items TO authenticated;
