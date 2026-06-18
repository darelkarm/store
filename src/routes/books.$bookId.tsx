import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getBookById, categories } from "@/data/books";
import { useBooks } from "@/hooks/use-books";
import { useLocationPricing } from "@/hooks/use-location-pricing";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Star, ArrowRight, BookOpen, Calendar, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/books/$bookId")({
  head: ({ params }) => {
    const book = getBookById(params.bookId);
    return {
      meta: [
        { title: book ? `${book.title} - دار الكرم` : "كتاب - دار الكرم" },
        { name: "description", content: book?.description || "" },
        { property: "og:title", content: book ? `${book.title} - دار الكرم` : "كتاب" },
        { property: "og:description", content: book?.description || "" },
      ],
    };
  },
  component: BookDetailPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground">الكتاب غير موجود</h1>
        <Link to="/books" className="text-primary mt-4 inline-block">العودة للكتب</Link>
      </div>
    </div>
  ),
});

function BookDetailPage() {
  const { bookId } = Route.useParams();
  const { books } = useBooks();
  const book = books.find((b) => b.id === bookId) ?? getBookById(bookId);
  const { formatPrice } = useLocationPricing();
  const { addToCart } = useCart();

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">الكتاب غير موجود</p>
      </div>
    );
  }

  const handleEbookRequest = () => {
    const message = encodeURIComponent(
      `مرحباً، أريد طلب النسخة الإلكترونية من كتاب "${book.title}" للمؤلف ${book.author}`
    );
    window.open(`https://wa.me/201289482247?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/books" className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline mb-6">
          <ArrowRight className="h-4 w-4" />
          العودة للكتب
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden relative">
            {book.cover ? (
              <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center p-10">
                <div className="text-center text-primary-foreground">
                  <p className="font-heading text-4xl font-bold leading-tight">{book.title}</p>
                  <p className="text-lg mt-4 text-primary-foreground/80">{book.author}</p>
                </div>
              </div>
            )}
            {book.isBestSeller && (
              <span className="absolute top-4 left-4 gold-gradient text-gold-foreground text-sm font-bold px-4 py-2 rounded-full">
                الأكثر مبيعًا
              </span>
            )}
          </div>

          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">{book.title}</h1>
            <p className="text-lg text-muted-foreground mt-2">{book.author}</p>
            {book.translator && (
              <p className="text-sm text-muted-foreground mt-1">ترجمة: {book.translator}</p>
            )}

            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-gold text-gold" />
                <span className="font-medium text-foreground">{book.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <BookOpen className="h-4 w-4" />
                {book.pages} صفحة
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Calendar className="h-4 w-4" />
                {book.year}
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-xl">
              <span className="text-3xl font-bold text-primary">{formatPrice(book.priceEGP, book.priceUSD)}</span>
            </div>

            <p className="mt-6 text-muted-foreground leading-relaxed">{book.description}</p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button size="xl" onClick={() => addToCart(book)} className="gap-2 flex-1">
                <ShoppingCart className="h-5 w-5" />
                أضف إلى السلة
              </Button>
              <Button size="xl" variant="outline" onClick={handleEbookRequest} className="gap-2 flex-1 border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                <MessageCircle className="h-5 w-5" />
                اطلب نسختك الإلكترونية
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-card rounded-lg p-4 border border-border">
                <p className="text-muted-foreground">التصنيف</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(() => {
                    const allSlugs = [book.categorySlug, ...(book.additionalCategories || [])];
                    return allSlugs.map((slug) => {
                      const cat = categories.find((c) => c.slug === slug);
                      return cat ? (
                        <span key={slug} className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                          {cat.name}
                        </span>
                      ) : null;
                    });
                  })()}
                </div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <p className="text-muted-foreground">سنة النشر</p>
                <p className="font-bold text-foreground mt-1">{book.year}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
