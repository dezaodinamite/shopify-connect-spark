import { Link } from "react-router-dom";
import { ShoppingCart, Moon, Sun } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartSheetTrigger } from "@/components/CartSheet";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import MobileNav from "@/components/MobileNav";


export default function Header() {
  const { count } = useCart();
  const { theme, setTheme } = useTheme();
  const prev = useRef(count);
  const [pop, setPop] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const increased = count > prev.current;
    prev.current = count;
    if (increased) {
      setPop(true);
      const t = setTimeout(() => setPop(false), 250);
      return () => clearTimeout(t);
    }
  }, [count]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${
      scrolled 
        ? "bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/95 shadow-sm" 
        : "bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    }`}>
      <div className="container mx-auto flex items-center justify-between py-3 md:py-4 px-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" aria-label="Página inicial Suívie">
          <img src="/lovable-uploads/b7ee09ad-b44f-44d1-9697-fc027b37c3f3.png" alt="Suívie Jabuticaba" className="h-8 w-auto" />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <a href="#produtos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Produtos</a>
          <a href="#sobre" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Sobre</a>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden md:flex"
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <CartSheetTrigger>
            <button className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity" aria-label={`Abrir carrinho com ${count} itens`}>
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Carrinho</span>
              <span aria-live="polite" className={`ml-1 rounded-full bg-brand px-2 py-0.5 text-[11px] text-brand-foreground font-medium ${pop ? "animate-scale-in" : ""}`}>{count}</span>
            </button>
          </CartSheetTrigger>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
