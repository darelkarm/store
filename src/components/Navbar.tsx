import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useBooks } from "@/hooks/use-books";
import logo from "@/assets/logo.png";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { itemCount } = useCart();
  const { books } = useBooks();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const links = [
    { to: "/" as const, label: "الرئيسية" },
    { to: "/books" as const, label: "الكتب" },
    { to: "/about" as const, label: "من نحن" },
    { to: "/contact" as const, label: "تواصل معنا" },
  ];

  const searchResults = searchQuery.trim().length >= 2
    ? books.filter(
        (b) =>
          b.title.includes(searchQuery) ||
          b.author.includes(searchQuery)
      ).slice(0, 6)
    : [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src={logo} alt="دار الكرم" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover" />
            <span className="font-heading text-base sm:text-lg font-bold text-primary hidden sm:block">دار الكرم</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" onClick={() => { setSearchOpen(!searchOpen); setShowResults(false); setSearchQuery(""); }}>
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -left-1 bg-gold text-gold-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-4 relative" ref={searchRef}>
            <input
              type="text"
              placeholder="ابحث عن كتاب بالعنوان أو المؤلف..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
              onFocus={() => setShowResults(true)}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                {searchResults.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => {
                      navigate({ to: "/books/$bookId", params: { bookId: book.id } });
                      setSearchOpen(false);
                      setSearchQuery("");
                      setShowResults(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-right"
                  >
                    <img src={book.cover} alt={book.title} className="w-8 h-10 rounded object-cover flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-heading font-bold text-foreground text-sm truncate">{book.title}</p>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {showResults && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 p-4 text-center">
                <p className="text-muted-foreground text-sm">لا توجد نتائج لـ "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
