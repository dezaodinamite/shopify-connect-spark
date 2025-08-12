import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface ProductNode {
  id: string;
  title: string;
  handle: string;
  description?: string;
  featuredImage?: { url: string; altText?: string } | null;
  priceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
  variants?: { nodes: { id: string }[] };
}

const currency = (amount: number, currencyCode: string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: currencyCode || "BRL" }).format(amount);

const Index = () => {
  const [products, setProducts] = useState<ProductNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.functions.invoke("shopify-products", {
        body: { action: "listProducts" },
      });
      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }
      const nodes: ProductNode[] = (data as any)?.data?.products?.nodes ?? [];
      setProducts(nodes);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <section className="relative">
        <img
          src="https://suivie.com.br/cdn/shop/files/Header_1.png?v=1697162644&width=1920"
          alt="Suívie Jabuticaba - hero com latas e jabuticabas"
          className="absolute inset-0 h-[48vh] w-full object-cover md:h-[60vh]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent" aria-hidden="true" />
        <div className="relative container mx-auto flex h-[48vh] flex-col justify-center md:h-[60vh]">
          <h1 className="text-3xl md:text-5xl font-bold max-w-2xl text-foreground">
            Suívie Jabuticaba – Loja Oficial
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl">
            Descubra nossas bebidas naturalmente antioxidantes. Direto da fazenda até você.
          </p>
          <div className="mt-6">
            <Button asChild size="lg">
              <a href="#produtos">Compre já</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="produtos" className="container mx-auto py-10">
        <h2 className="sr-only">Produtos</h2>
        {loading ? (
          <p className="text-muted-foreground">Carregando produtos…</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <article key={p.id} className="border rounded-lg overflow-hidden bg-card">
                {p.featuredImage?.url && (
                  <img
                    src={p.featuredImage.url}
                    alt={p.featuredImage?.altText || p.title}
                    className="w-full h-56 object-cover"
                    loading="lazy"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {currency(parseFloat(p.priceRange?.minVariantPrice.amount || "0"), p.priceRange?.minVariantPrice.currencyCode || "BRL")}
                    </span>
                    <Button asChild size="sm">
                      <Link to={`/product/${p.handle}`}>Ver produto</Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Index;
