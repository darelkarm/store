import { books, categories } from '../src/data/books.ts';
const esc = (s) => String(s).replaceAll("'", "''");
let out = '-- AUTO-GENERATED seed. Run AFTER schema.sql in your Supabase SQL editor.\n\n';
out += 'INSERT INTO public.categories (slug, name, sort_order) VALUES\n';
out += categories.map((c, i) => `  ('${esc(c.slug)}', '${esc(c.name)}', ${i})`).join(',\n');
out += '\nON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;\n\n';
out += 'INSERT INTO public.books (id, title, author, translator, description, cover, price_egp, price_usd, category_slug, additional_categories, is_best_seller, is_featured, rating, pages, year) VALUES\n';
out += books.map(b => {
  const addl = b.additionalCategories && b.additionalCategories.length
    ? `ARRAY[${b.additionalCategories.map(c=>`'${esc(c)}'`).join(',')}]::text[]`
    : `'{}'::text[]`;
  return `  ('${esc(b.id)}', '${esc(b.title)}', '${esc(b.author)}', ${b.translator ? `'${esc(b.translator)}'` : 'NULL'}, '${esc(b.description)}', '${esc(b.cover)}', ${b.priceEGP}, ${b.priceUSD}, '${esc(b.categorySlug)}', ${addl}, ${b.isBestSeller?'true':'false'}, ${b.isFeatured?'true':'false'}, ${b.rating}, ${b.pages}, ${b.year})`;
}).join(',\n');
out += '\nON CONFLICT (id) DO NOTHING;\n';
process.stdout.write(out);
