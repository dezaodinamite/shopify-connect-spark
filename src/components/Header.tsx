import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartSheetTrigger } from "@/components/CartSheet";
import { useEffect, useRef, useState } from "react";
// import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import MobileNav from "@/components/MobileNav";
import SearchDialog from "@/components/SearchDialog";

export default function Header() {
  const { count } = useCart();
  // const { theme, setTheme } = useTheme();
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
    <header className="sticky top-0 z-50 w-full soft-transition safe-top glass-header">
      <div className="container mx-auto px-4">
        {/* Mobile Layout: Menu | Logo | Cart */}
        <div className="grid grid-cols-[44px_1fr_44px] md:flex md:justify-between items-center h-16 gap-4">
          {/* Mobile Menu - Left */}
          <div className="md:hidden justify-self-start">
            <MobileNav />
          </div>

          {/* Logo - Centered on mobile, left on desktop */}
          <Link to="/" className="justify-self-center md:justify-self-start flex items-center">
            <img 
              src="/lovable-uploads/b7ee09ad-b44f-44d1-9697-fc027b37c3f3.png" 
              alt="Suívie Logo" 
              className="h-9 w-auto md:h-11"
            />
          </Link>

          {/* Mobile Cart - Right */}
          <div className="md:hidden justify-self-end">
            <CartSheetTrigger>
              <Button variant="ghost" size="icon" className="relative h-11 w-11">
                <ShoppingCart className="h-5 w-5 text-brand" strokeWidth={1.5} />
                {count > 0 && (
                  <span 
                    className={`absolute -top-1 -right-1 bg-brand text-brand-foreground text-xs radius-pill h-5 w-5 flex items-center justify-center soft-transition min-w-[20px] ${
                      pop ? 'animate-pulse' : ''
                    }`}
                  >
                    {count}
                  </span>
                )}
              </Button>
            </CartSheetTrigger>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-sm font-medium text-foreground hover:text-brand soft-transition"
            >
              Home
            </Link>
            <a 
              href="#produtos" 
              className="text-sm font-medium text-foreground hover:text-brand soft-transition"
            >
              Produtos
            </a>
            <a 
              href="#sobre" 
              className="text-sm font-medium text-foreground hover:text-brand soft-transition"
            >
              Sobre
            </a>
            <Link 
              to="/faq" 
              className="text-sm font-medium text-foreground hover:text-brand soft-transition"
            >
              FAQ
            </Link>
            <Link 
              to="/contato" 
              className="text-sm font-medium text-foreground hover:text-brand soft-transition"
            >
              Contato
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search dialog trigger (Ctrl/Cmd+K) */}
            <SearchDialog />

            <CartSheetTrigger>
              <Button variant="ghost" size="icon" className="relative h-11 w-11">
                <ShoppingCart className="h-5 w-5 text-brand" strokeWidth={1.5} />
                {count > 0 && (
                  <span 
                    className={`absolute -top-1 -right-1 bg-brand text-brand-foreground text-xs radius-pill h-5 w-5 flex items-center justify-center soft-transition min-w-[20px] ${
                      pop ? 'animate-pulse' : ''
                    }`}
                  >
                    {count}
                  </span>
                )}
              </Button>
            </CartSheetTrigger>
          </div>
        </div>
      </div>
    </header>
  );
}
