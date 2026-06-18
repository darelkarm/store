-- ============================================================
-- Karam Publishing — Supabase schema
-- Run this ONCE in: Supabase Dashboard → SQL Editor → New Query
-- Then run supabase/seed.sql to import all existing books.
-- ============================================================

-- ---------- ADMIN ROLES (must come first — used by policies below) ----------
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role    public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_roles_self_read" ON public.user_roles;
CREATE POLICY "user_roles_self_read" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'
  );
$$;

-- ---------- CATEGORIES ----------
CREATE TABLE IF NOT EXISTS public.categories (
  slug        text PRIMARY KEY,
  name        text NOT NULL,
  sort_order  int  NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories_public_read" ON public.categories;
CREATE POLICY "categories_public_read" ON public.categories
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "categories_admin_write" ON public.categories;
CREATE POLICY "categories_admin_write" ON public.categories
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ---------- BOOKS ----------
CREATE TABLE IF NOT EXISTS public.books (
  id                    text PRIMARY KEY,
  title                 text NOT NULL,
  author                text NOT NULL,
  translator            text,
  description           text NOT NULL DEFAULT '',
  cover                 text NOT NULL DEFAULT '',
  price_egp             numeric NOT NULL DEFAULT 0,
  price_usd             numeric NOT NULL DEFAULT 0,
  category_slug         text NOT NULL REFERENCES public.categories(slug),
  additional_categories text[] NOT NULL DEFAULT '{}',
  is_best_seller        boolean NOT NULL DEFAULT false,
  is_featured           boolean NOT NULL DEFAULT false,
  rating                numeric NOT NULL DEFAULT 0,
  pages                 int     NOT NULL DEFAULT 0,
  year                  int     NOT NULL DEFAULT 0,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.books TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.books TO authenticated;
GRANT ALL ON public.books TO service_role;

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "books_public_read" ON public.books;
CREATE POLICY "books_public_read" ON public.books
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "books_admin_write" ON public.books;
CREATE POLICY "books_admin_write" ON public.books
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Auto-update updated_at on UPDATE
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS books_touch_updated_at ON public.books;
CREATE TRIGGER books_touch_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
