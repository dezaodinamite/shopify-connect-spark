import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Hero from "@/components/Hero";
import ProductSkeleton from "@/components/ProductSkeleton";

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
      <header>
        <Hero />
      </header>

      <section id="produtos" className="container mx-auto py-16 px-4 md:py-20">
        <header className="mb-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-primary mb-4">Nossos Produtos</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Descobra a linha completa Suívie Jabuticaba - sabor autêntico e qualidade premium</p>
        </header>
        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((p) => (
              <article key={p.id} className="group overflow-hidden rounded-xl border bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="relative overflow-hidden">
                  <AspectRatio ratio={1}>
                    <img
                      src={p.featuredImage?.url || "/placeholder.svg"}
                      alt={p.featuredImage?.altText || `Imagem do produto ${p.title}`}
                      className="h-full w-full object-contain bg-card p-6 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </AspectRatio>
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-brand transition-colors">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold text-brand">
                      {currency(parseFloat(p.priceRange?.minVariantPrice.amount || "0"), p.priceRange?.minVariantPrice.currencyCode || "BRL")}
                    </span>
                    <Button asChild size="sm" variant="brand" className="rounded-full">
                      <Link to={`/product/${p.handle}`} aria-label={`Ver detalhes de ${p.title}`}>Ver produto</Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Seção Sobre */}
      <section id="sobre" className="relative w-full py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-brand/5">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:gap-16 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <img
                src="/lovable-uploads/afd87f4b-f8d6-4012-8360-6bcc57920347.png"
                alt="Consumidora apresentando a bebida Suívie Jabuticaba"
                className="w-full h-[420px] md:h-[520px] object-cover rounded-2xl shadow-lg"
                loading="lazy"
              />
            </div>
            <article className="order-1 md:order-2 space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary leading-tight">
                Primeira bebida naturalmente antioxidante do mundo
              </h2>
              <p className="text-foreground/80 leading-relaxed text-lg">
                Bem-vindo à Suívie Jabuticaba, a PRIMEIRA bebida naturalmente antioxidante do mundo. Combinamos a natureza Brasileira com a qualidade Suíça.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                Seja para um pré-treino para melhorar as funções do organismo, ou pós a atividade física para recuperar eletrólitos e repor energia, essa bebida contém a magia da Jabuticaba.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Seção Ingredientes */}
      <section className="relative w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:gap-16 md:grid-cols-2">
            <article className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-brand leading-tight">
                O melhor do Brasil mantido em segredo, até agora...
              </h2>
              <p className="text-foreground/80 leading-relaxed text-lg">
                Essa super fruta é uma verdadeira bomba de nutrientes, antioxidantes e polifenóis, que nós combinamos apenas com maçã e um toque de gengibre - e nada mais!
              </p>
            </article>
            <div>
              <img
                src="/lovable-uploads/13500a28-1b95-404c-b935-d463f3030c4e.png"
                alt="Jabuticabas - super fruta rica em antioxidantes"
                className="w-full h-[360px] md:h-[460px] object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção CTA Final */}
      <section className="relative w-full py-16 md:py-24 bg-gradient-to-br from-brand/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:gap-16 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <img
                src="/lovable-uploads/7b4ceade-aae9-4b29-8d6d-5c8b74bb2085.png"
                alt="Latas Suívie Jabuticaba em bolsa de juta"
                className="w-full h-[420px] md:h-[520px] object-cover rounded-2xl shadow-lg"
                loading="lazy"
              />
            </div>
            <article className="order-1 md:order-2 space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary leading-tight">
                TRULY FRESH, HONESTLY HEALTHY.
              </h2>
              <p className="text-foreground/80 leading-relaxed text-lg">
                Suívie é uma deliciosa infusão Suiço-Brasileira transbordando de Jabuticaba e maçãs frescas.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                Todos os ingredientes 100% naturais nesta bebida de fruta são riquíssimos em antioxidantes e naturalmente baixos em calorias e açúcar.
              </p>
              <div className="pt-4">
                <Button asChild variant="brand" size="lg" className="rounded-full px-8 text-base font-semibold hover:scale-105 transition-transform">
                  <a href="#produtos" aria-label="Ver produtos Suívie">Experimente agora</a>
                </Button>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
