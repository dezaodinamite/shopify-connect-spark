import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartSheetTrigger } from "@/components/CartSheet";
import { useEffect, useRef, useState } from "react";


export default function Header() {
  const { count } = useCart();
  const prev = useRef(count);
  const [pop, setPop] = useState(false);
  useEffect(() => {
    const increased = count > prev.current;
    prev.current = count;
    if (increased) {
      setPop(true);
      const t = setTimeout(() => setPop(false), 250);
      return () => clearTimeout(t);
    }
  }, [count]);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2" aria-label="Página inicial Suívie">
          <img src="/lovable-uploads/77a04651-2e18-4635-8c13-7797db38a6a7.png" alt="Suívie Jabuticaba" className="h-8 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-6" aria-label="Navegação principal">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <a href="#produtos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Produtos</a>
        </nav>
        <CartSheetTrigger>
          <button className="inline-flex items-center gap-2 text-sm" aria-label={`Abrir carrinho com ${count} itens`}>
            <ShoppingCart className="size-5" />
            <span className="hidden sm:inline">Carrinho</span>
            <span aria-live="polite" className={`ml-1 rounded-full bg-brand px-2 py-0.5 text-[11px] text-brand-foreground ${pop ? "animate-scale-in" : ""}`}>{count}</span>
          </button>
        </CartSheetTrigger>
      </div>
    </header>
  );
}
