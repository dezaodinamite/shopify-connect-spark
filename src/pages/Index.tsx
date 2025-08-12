import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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

  // SEO basics for the Home page
  useEffect(() => {
    document.title = "Suívie Jabuticaba – Loja Oficial";
    const desc =
      "Bebidas de jabuticaba naturalmente antioxidantes. Compre online.";

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.href);
  }, []);


  return (
    <main className="min-h-screen bg-background">
      <section className="relative">
        <img
          src="https://suivie.com.br/cdn/shop/files/Header_1.png?v=1697162644&width=1920"
          alt="Suívie Jabuticaba - hero com latas e jabuticabas"
          className="absolute inset-0 h-[70vh] w-full object-cover md:h-[85vh]"
          loading="lazy"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent"
          aria-hidden="true"
        />
        <div className="relative container mx-auto flex h-[70vh] flex-col justify-center md:h-[85vh]">
          <h1 className="max-w-3xl text-balance text-4xl md:text-6xl font-extrabold tracking-tight text-foreground animate-fade-in">
            Suívie Jabuticaba – Loja Oficial
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-muted-foreground animate-fade-in">
            Descubra nossas bebidas naturalmente antioxidantes. Direto da fazenda até você.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="rounded-full px-8 py-6 hover-scale shadow-md">
              <a href="#produtos" aria-label="Ir para a seção de produtos Suívie">Compre já</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="produtos" className="container mx-auto py-14">
        <header className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Destaques</h2>
          <p className="text-muted-foreground mt-1">Selecionamos os queridinhos da Suívie para você</p>
        </header>
        {loading ? (
          <p className="text-muted-foreground">Carregando produtos…</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((p) => (
              <article key={p.id} className="group overflow-hidden rounded-xl border bg-card hover:shadow-lg transition-shadow">
                <div className="relative">
                  <AspectRatio ratio={4/3}>
                    <img
                      src={p.featuredImage?.url || "/placeholder.svg"}
                      alt={p.featuredImage?.altText || `Imagem do produto ${p.title}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </AspectRatio>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{p.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-base font-semibold">
                      {currency(parseFloat(p.priceRange?.minVariantPrice.amount || "0"), p.priceRange?.minVariantPrice.currencyCode || "BRL")}
                    </span>
                    <Button asChild size="sm">
                      <Link to={`/product/${p.handle}`} aria-label={`Ver detalhes de ${p.title}`}>Ver produto</Link>
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
