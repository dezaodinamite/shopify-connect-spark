import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function Header() {
  const { count } = useCart();
  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link to="/" className="font-semibold text-xl tracking-tight">
          Suívie
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/cart" className="inline-flex items-center gap-2 text-sm">
            <ShoppingCart className="size-4" />
            Carrinho ({count})
          </Link>
        </nav>
      </div>
    </header>
  );
}
