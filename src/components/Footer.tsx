import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-brand text-brand-foreground mt-10 rounded-none w-full">
      <div className="container mx-auto py-10 rounded-none">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <img 
              src="/lovable-uploads/6ec130e7-47e5-445d-86ce-4b37149d14a4.png" 
              alt="Suívie Jabuticaba Logo" 
              className="h-12 w-auto"
            />
            <p className="mt-2 text-sm opacity-90">
              Bebidas naturalmente antioxidantes,<br />
              direto da fazenda até você.
            </p>
          </div>
          <nav aria-label="Links rápidos" className="grid grid-cols-2 gap-2 text-sm">
            <span className="font-medium">Links rápidos</span>
            <Link to="/" className="opacity-90 hover:opacity-100 underline-offset-4 hover:underline">Home</Link>
            <a href="#produtos" className="opacity-90 hover:opacity-100 underline-offset-4 hover:underline">Produtos</a>
            <Link to="/faq" className="opacity-90 hover:opacity-100 underline-offset-4 hover:underline">FAQ</Link>
            <Link to="/contato" className="opacity-90 hover:opacity-100 underline-offset-4 hover:underline">Contato</Link>
            <Link to="/cart" className="opacity-90 hover:opacity-100 underline-offset-4 hover:underline">Carrinho</Link>
          </nav>
        </div>
        
        {/* Footer bottom - Copyright and credits aligned */}
        <div className="mt-8 pt-6 border-t border-brand-foreground/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm opacity-90">
          <p>
            © {new Date().getFullYear()} Suívie Jabuticaba. Todos os direitos reservados.
          </p>
          <p className="text-xs italic">
            Designed & deployed by Agrega Commerce
          </p>
        </div>
      </div>
    </footer>
  );
}
