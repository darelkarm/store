import { createClient } from "@supabase/supabase-js";

// Public Supabase project — anon key is safe to ship in client code.
// RLS protects all writes; only admins (via user_roles) can mutate.
const SUPABASE_URL = "https://tfbtuydbhqcuejaeisho.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmYnR1eWRiaHFjdWVqYWVpc2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MDk0NTYsImV4cCI6MjA5NzM4NTQ1Nn0.rTRrvk4V2IO5pJREulzLZ3AkU8YAK1CrGlRDOylbN18";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "karam-auth",
  },
});

export interface DbBook {
  id: string;
  title: string;
  author: string;
  translator: string | null;
  description: string;
  cover: string;
  price_egp: number;
  price_usd: number;
  category_slug: string;
  additional_categories: string[];
  is_best_seller: boolean;
  is_featured: boolean;
  rating: number;
  pages: number;
  year: number;
}

export interface DbCategory {
  slug: string;
  name: string;
  sort_order: number;
}
