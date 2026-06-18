import { useEffect, useState } from "react";
import { supabase, type DbBook, type DbCategory } from "@/lib/supabase";
import type { Book, Category } from "@/data/books";
import {
  books as fallbackBooks,
  categories as fallbackCategories,
} from "@/data/books";

function mapBook(row: DbBook, categoryName: string): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    translator: row.translator ?? undefined,
    description: row.description,
    cover: row.cover,
    priceEGP: Number(row.price_egp),
    priceUSD: Number(row.price_usd),
    category: categoryName,
    categorySlug: row.category_slug,
    additionalCategories: row.additional_categories ?? [],
    isBestSeller: row.is_best_seller,
    isFeatured: row.is_featured,
    rating: Number(row.rating),
    pages: row.pages,
    year: row.year,
  };
}

let cache: { books: Book[]; categories: Category[] } | null = null;
let inflight: Promise<{ books: Book[]; categories: Category[] }> | null = null;
const listeners = new Set<() => void>();

async function load() {
  if (inflight) return inflight;
  inflight = (async () => {
    const [{ data: catData }, { data: bookData }] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("books").select("*"),
    ]);
    const cats: Category[] =
      catData && catData.length
        ? (catData as DbCategory[]).map((c) => ({ slug: c.slug, name: c.name }))
        : fallbackCategories;
    const nameMap = new Map(cats.map((c) => [c.slug, c.name]));
    const mapped: Book[] =
      bookData && bookData.length
        ? (bookData as DbBook[]).map((b) =>
            mapBook(b, nameMap.get(b.category_slug) ?? b.category_slug),
          )
        : fallbackBooks;
    cache = { books: mapped, categories: cats };
    listeners.forEach((l) => l());
    return cache;
  })();
  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

export function refreshBooks() {
  cache = null;
  return load();
}

export function useBooks() {
  const [state, setState] = useState(cache);
  useEffect(() => {
    const l = () => setState(cache);
    listeners.add(l);
    if (!cache) load().catch(() => {});
    return () => {
      listeners.delete(l);
    };
  }, []);
  return {
    books: state?.books ?? fallbackBooks,
    categories: state?.categories ?? fallbackCategories,
    loaded: !!state,
  };
}

export function getBooksByCategoryFrom(books: Book[], slug: string): Book[] {
  if (slug === "best-sellers") return books.filter((b) => b.isBestSeller);
  return books.filter(
    (b) => b.categorySlug === slug || b.additionalCategories?.includes(slug),
  );
}
