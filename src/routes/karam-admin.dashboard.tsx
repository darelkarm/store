import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase, type DbBook, type DbCategory } from "@/lib/supabase";
import { refreshBooks } from "@/hooks/use-books";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, LogOut } from "lucide-react";

export const Route = createFileRoute("/karam-admin/dashboard")({
  ssr: false,
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: AdminDashboard,
});

const empty: DbBook = {
  id: "",
  title: "",
  author: "",
  translator: null,
  description: "",
  cover: "",
  price_egp: 0,
  price_usd: 0,
  category_slug: "",
  additional_categories: [],
  is_best_seller: false,
  is_featured: false,
  rating: 0,
  pages: 0,
  year: new Date().getFullYear(),
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [books, setBooks] = useState<DbBook[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [editing, setEditing] = useState<DbBook | null>(null);
  const [filter, setFilter] = useState("");

  const reload = useCallback(async () => {
    const [{ data: b }, { data: c }] = await Promise.all([
      supabase.from("books").select("*").order("title"),
      supabase.from("categories").select("*").order("sort_order"),
    ]);
    setBooks((b as DbBook[]) || []);
    setCategories((c as DbCategory[]) || []);
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate({ to: "/karam-admin" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id)
        .eq("role", "admin");
      if (!roles || roles.length === 0) {
        await supabase.auth.signOut();
        navigate({ to: "/karam-admin" });
        return;
      }
      setAuthChecked(true);
      reload();
    })();
  }, [navigate, reload]);

  async function handleSave(book: DbBook) {
    const payload = { ...book, additional_categories: book.additional_categories ?? [] };
    const isNew = !books.find((b) => b.id === book.id);
    const { error } = isNew
      ? await supabase.from("books").insert(payload)
      : await supabase.from("books").update(payload).eq("id", book.id);
    if (error) {
      toast.error("فشل الحفظ: " + error.message);
      return;
    }
    toast.success(isNew ? "تمت إضافة الكتاب" : "تم تحديث الكتاب");
    setEditing(null);
    await reload();
    await refreshBooks();
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الكتاب؟")) return;
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) {
      toast.error("فشل الحذف: " + error.message);
      return;
    }
    toast.success("تم الحذف");
    await reload();
    await refreshBooks();
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/karam-admin" });
  }

  if (!authChecked) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">جاري التحقق...</div>;
  }

  const filtered = books.filter(
    (b) => !filter || b.title.includes(filter) || b.author.includes(filter) || b.id.includes(filter),
  );

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-heading text-xl font-bold">لوحة تحكم الكتب</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => setEditing({ ...empty, id: String(Date.now()) })}
              size="sm"
            >
              <Plus className="h-4 w-4 ml-1" /> كتاب جديد
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 ml-1" /> خروج
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-4 flex items-center gap-3">
          <Input
            placeholder="بحث بالعنوان أو المؤلف أو الرقم..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-md"
          />
          <span className="text-sm text-muted-foreground">{filtered.length} / {books.length} كتاب</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <div key={b.id} className="border border-border rounded-xl p-3 bg-card flex gap-3">
              <img src={b.cover} alt={b.title} className="w-16 h-24 object-cover rounded" />
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{b.title}</p>
                <p className="text-xs text-muted-foreground truncate">{b.author}</p>
                <p className="text-xs text-muted-foreground">{b.category_slug} • {b.price_egp} ج.م</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(b)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(b.id)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {editing && (
        <EditModal
          book={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function EditModal({
  book,
  categories,
  onClose,
  onSave,
}: {
  book: DbBook;
  categories: DbCategory[];
  onClose: () => void;
  onSave: (b: DbBook) => void;
}) {
  const [form, setForm] = useState<DbBook>(book);
  const set = <K extends keyof DbBook>(k: K, v: DbBook[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-2xl my-8">
        <h2 className="font-heading text-xl font-bold mb-4">{book.title ? "تعديل كتاب" : "كتاب جديد"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          <Field label="الرقم (ID)"><Input value={form.id} onChange={(e) => set("id", e.target.value)} /></Field>
          <Field label="العنوان"><Input value={form.title} onChange={(e) => set("title", e.target.value)} /></Field>
          <Field label="المؤلف"><Input value={form.author} onChange={(e) => set("author", e.target.value)} /></Field>
          <Field label="المترجم"><Input value={form.translator ?? ""} onChange={(e) => set("translator", e.target.value || null)} /></Field>
          <Field label="السعر بالجنيه"><Input type="number" value={form.price_egp} onChange={(e) => set("price_egp", +e.target.value)} /></Field>
          <Field label="السعر بالدولار"><Input type="number" value={form.price_usd} onChange={(e) => set("price_usd", +e.target.value)} /></Field>
          <Field label="عدد الصفحات"><Input type="number" value={form.pages} onChange={(e) => set("pages", +e.target.value)} /></Field>
          <Field label="سنة النشر"><Input type="number" value={form.year} onChange={(e) => set("year", +e.target.value)} /></Field>
          <Field label="التقييم (0-5)"><Input type="number" step="0.1" value={form.rating} onChange={(e) => set("rating", +e.target.value)} /></Field>
          <Field label="التصنيف الرئيسي">
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={form.category_slug}
              onChange={(e) => set("category_slug", e.target.value)}
            >
              <option value="">-- اختر --</option>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="تصنيفات إضافية (مفصولة بفواصل)">
            <Input
              value={(form.additional_categories ?? []).join(",")}
              onChange={(e) => set("additional_categories", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            />
          </Field>
          <Field label="رابط الغلاف" className="sm:col-span-2">
            <Input value={form.cover} onChange={(e) => set("cover", e.target.value)} />
          </Field>
          <Field label="النبذة" className="sm:col-span-2">
            <Textarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_best_seller} onChange={(e) => set("is_best_seller", e.target.checked)} />
            الأكثر مبيعًا
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} />
            كتاب مميز
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
          <Button onClick={() => onSave(form)}>حفظ</Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="mb-1 block">{label}</Label>
      {children}
    </div>
  );
}
