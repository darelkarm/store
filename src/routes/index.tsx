import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookCard } from "@/components/BookCard";
import { BookishPattern } from "@/components/BookishPattern";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { useBooks } from "@/hooks/use-books";
import { ArrowLeft, BookOpen, Users, Globe, Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "دار الكرم للنشر والتوزيع والترجمة" },
      { name: "description", content: "دار الكرم - دار نشر عربية متخصصة في نشر وتوزيع وترجمة أفضل الكتب" },
      { property: "og:title", content: "دار الكرم للنشر والتوزيع والترجمة" },
      { property: "og:description", content: "دار نشر عربية متخصصة في نشر وتوزيع وترجمة أفضل الكتب" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { books, categories } = useBooks();
  const featured = books.filter((b) => b.isFeatured);
  const bestSellers = books.filter((b) => b.isBestSeller);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <BookishPattern opacity={0.06} className="text-primary-foreground" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-40 sm:w-72 h-40 sm:h-72 rounded-full border border-primary-foreground/10 animate-[spin_40s_linear_infinite]" />
          <div className="absolute bottom-10 left-10 sm:left-20 w-60 sm:w-[28rem] h-60 sm:h-[28rem] rounded-full border border-primary-foreground/5 animate-[spin_60s_linear_infinite_reverse]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] rounded-full bg-primary-foreground/5 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-24 md:py-32 relative">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <div className="flex-1 text-center md:text-right order-2 md:order-1 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-1.5 mb-4 sm:mb-6 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="text-primary-foreground/90 text-xs sm:text-sm font-medium">اكتشف عالم القراءة</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-5xl md:text-7xl font-black text-primary-foreground text-shadow-soft leading-tight">
                دار الكرم
              </h1>
              <p className="text-lg sm:text-2xl md:text-3xl text-primary-foreground/80 mt-2 sm:mt-3 font-heading font-light">
                للنشر والتوزيع والترجمة
              </p>
              <p className="text-primary-foreground/60 mt-3 sm:mt-6 text-sm sm:text-lg max-w-lg leading-relaxed mx-auto md:mx-0">
                نفتح لك أبواب المعرفة من خلال مجموعة متنوعة من أفضل الكتب العربية والمترجمة
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-10 justify-center md:justify-start">
                <Link to="/books">
                  <Button variant="hero" size="lg" className="shadow-lg shadow-primary-foreground/10 hover-scale">
                    تصفح الكتب
                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="heroOutline" size="lg" className="hover-scale">
                    من نحن
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0 order-1 md:order-2 animate-scale-in">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gold/20 blur-2xl scale-110 animate-[pulse_3s_ease-in-out_infinite]" />
                <img src={logo} alt="دار الكرم" className="relative w-28 h-28 sm:w-52 sm:h-52 md:w-72 md:h-72 rounded-full shadow-2xl border-4 border-primary-foreground/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-card border-b border-border relative -mt-6 sm:-mt-8 z-10 mx-4 sm:mx-8 lg:mx-auto max-w-5xl rounded-2xl shadow-xl">
        <div className="px-4 py-6 sm:py-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
          {[
            { icon: BookOpen, label: "كتاب متاح", value: "+100" },
            { icon: Users, label: "قارئ سعيد", value: "+1000" },
            { icon: Globe, label: "دولة", value: "+10" },
            { icon: BookOpen, label: "مؤلف", value: "+100" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1 sm:gap-2 group">
              <div className="p-2 sm:p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
              </div>
              <span className="text-xl sm:text-3xl font-black text-foreground">{stat.value}</span>
              <span className="text-[10px] sm:text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="pt-14 sm:pt-20 pb-10 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-10">
            <div>
              <h2 className="font-heading text-xl sm:text-3xl font-bold text-foreground">كتب مميزة</h2>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">اختيارات مميزة من دار الكرم</p>
            </div>
            <Link to="/books" className="text-primary text-xs sm:text-sm font-medium hover:underline inline-flex items-center gap-1">
              عرض الكل
              <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {featured.slice(0, 4).map((book, i) => (
              <div key={book.id} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 sm:py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-xl sm:text-3xl font-bold text-foreground mb-2 text-center">التصنيفات</h2>
          <p className="text-muted-foreground text-xs sm:text-sm text-center mb-6 sm:mb-8">اكتشف الكتب حسب اهتماماتك</p>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
            {categories.filter(c => c.slug !== "best-sellers").map((cat, i) => (
              <Link
                key={cat.slug}
                to="/books"
                search={{ category: cat.slug }}
                className="bg-card rounded-xl p-3 sm:p-5 text-center card-hover border border-border group animate-fade-in"
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
              >
                <div className="flex justify-center mb-1 sm:mb-3">
                  <CategoryIcon slug={cat.slug} className="h-8 w-8 sm:h-10 sm:w-10 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-heading font-bold text-foreground text-xs sm:text-base group-hover:text-primary transition-colors">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-10">
            <div>
              <h2 className="font-heading text-xl sm:text-3xl font-bold text-foreground">الأكثر مبيعًا</h2>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">الكتب الأكثر طلبًا من قرائنا</p>
            </div>
            <Link to="/books" search={{ category: "best-sellers" }} className="text-primary text-xs sm:text-sm font-medium hover:underline inline-flex items-center gap-1">
              عرض الكل
              <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
            {bestSellers.slice(0, 3).map((book, i) => (
              <div key={book.id} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 hero-gradient relative overflow-hidden">
        <BookishPattern opacity={0.05} className="text-primary-foreground" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-primary-foreground mb-4">
            ابدأ رحلتك مع القراءة اليوم
          </h2>
          <p className="text-primary-foreground/70 text-sm sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            اكتشف مجموعتنا المتنوعة من الكتب واطلب الآن بكل سهولة عبر واتساب
          </p>
          <Link to="/books">
            <Button variant="hero" size="lg" className="shadow-lg hover-scale">
              تصفح المكتبة
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 sm:py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-xl sm:text-3xl font-bold text-foreground mb-2 text-center">آراء القراء</h2>
          <p className="text-muted-foreground text-xs sm:text-sm text-center mb-6 sm:mb-8">ماذا يقول قراؤنا عنّا</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { name: "أحمد محمد", text: "مكتبة رائعة وتوصيل سريع. الكتب بحالة ممتازة والأسعار مناسبة جداً.", rating: 5 },
              { name: "سارة علي", text: "أفضل دار نشر تعاملت معها. مجموعة متنوعة من الكتب وخدمة عملاء ممتازة.", rating: 5 },
              { name: "محمد حسن", text: "تجربة شراء سلسة ومريحة. أنصح بها بشدة لكل محبي القراءة.", rating: 4 },
            ].map((review, i) => (
              <div key={i} className="bg-card rounded-xl p-5 sm:p-6 border border-border card-hover animate-fade-in" style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'both' }}>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <span key={j} className="text-gold">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{review.text}"</p>
                <p className="font-bold text-foreground text-sm">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
