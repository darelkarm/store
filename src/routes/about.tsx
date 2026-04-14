import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookOpen, Globe, Users, Award, Calendar, Heart, CreditCard } from "lucide-react";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن - دار الكرم" },
      { name: "description", content: "تعرف على دار الكرم للنشر والتوزيع والترجمة - رسالتنا ورؤيتنا" },
      { property: "og:title", content: "من نحن - دار الكرم" },
      { property: "og:description", content: "تعرف على دار الكرم للنشر والتوزيع والترجمة" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <img src={logo} alt="دار الكرم" className="h-32 w-32 rounded-full mx-auto mb-6 shadow-lg" />
          <h1 className="font-heading text-4xl font-bold text-foreground">دار الكرم</h1>
          <p className="text-xl text-muted-foreground mt-2">للنشر والتوزيع والترجمة</p>
          <p className="text-primary font-heading font-bold text-lg mt-4">﴿ الكرم في كل صفحة... المعرفة في كل كلمة ﴾</p>
        </div>

        {/* Story */}
        <div className="bg-card rounded-xl p-6 sm:p-8 border border-border mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-6 w-6 text-gold" />
            <h2 className="font-heading text-xl font-bold text-foreground">قصتنا</h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>تم تأسيس دار الكرم في عام ٢٠٢٣، بهدف مساعدة الأدباء والشباب في مشوارهم الأدبي وتقديم أفضل الإصدارات الأدبية والفكرية للقارئ العربي.</p>
            <p>تضم دار الكرم أدبائها من مصر والوطن العربي والأجنبي، ونسعى لبناء جسور ثقافية من خلال ترجمة الأعمال العالمية المتميزة ونشر الإبداعات العربية الأصيلة.</p>
            <p>يتم توصيل أي إصدار داخل دار الكرم في جميع أنحاء العالم.</p>
          </div>
        </div>

        {/* Values cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            { icon: BookOpen, title: "رسالتنا", text: "نشر المعرفة وتوفير كتب عالية الجودة تثري العقل العربي ومساعدة الأدباء والشباب في مشوارهم الأدبي" },
            { icon: Globe, title: "رؤيتنا", text: "أن نكون الوجهة الأولى للقراء العرب حول العالم ونوصل إصداراتنا لكل مكان" },
            { icon: Users, title: "فريقنا", text: "نخبة من المحررين والمترجمين المتخصصين في مختلف المجالات من مصر والوطن العربي والأجنبي" },
            { icon: Award, title: "قيمنا", text: "الجودة والإبداع والالتزام بتقديم أفضل المحتوى الثقافي الكرم في كل صفحة... المعرفة في كل كلمة" },
          ].map((item, i) => (
            <div key={i} className="bg-card rounded-xl p-6 border border-border card-hover">
              <item.icon className="h-10 w-10 text-gold mb-4" />
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Bank Info */}
        <div className="bg-card rounded-xl p-6 sm:p-8 border border-border mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-6 w-6 text-gold" />
            <h2 className="font-heading text-xl font-bold text-foreground">بيانات الحساب البنكي</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">رقم الحساب البنكي (IBAN)</p>
              <p className="font-mono font-bold text-foreground mt-1 text-sm" dir="ltr">EG790005101700000117030811001</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">رقم التحويل</p>
              <p className="font-mono font-bold text-foreground mt-1" dir="ltr">+20 128 948 2247</p>
            </div>
          </div>
        </div>

        {/* Leadership */}
        <div className="bg-card rounded-xl p-6 sm:p-8 border border-border">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="h-6 w-6 text-gold" />
            <h2 className="font-heading text-xl font-bold text-foreground">الإدارة</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="text-center p-4 bg-muted/50 rounded-xl">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-foreground text-lg">كريم السيد</h3>
              <p className="text-muted-foreground text-sm">رئيس مجلس الإدارة</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-xl">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-foreground text-lg">ندى أحمد</h3>
              <p className="text-muted-foreground text-sm">المديرة العام</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
