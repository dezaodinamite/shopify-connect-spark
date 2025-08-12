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
          <h1 className="max-w-3xl text-balance font-playfair text-4xl md:text-6xl font-extrabold tracking-tight text-[hsl(var(--hero-title))] animate-fade-in">
            Agora é a vez da Jabuticaba! O melhor do Brasil mantido em segredo, até agora...
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-foreground/90 animate-fade-in">
            Direto da fazenda até você - simples assim!
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="brand" className="rounded-full px-8 py-6 hover-scale shadow-md">
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
              <article key={p.id} className="group overflow-hidden rounded-2xl border bg-card hover:shadow-lg transition-shadow">
                <div className="relative">
                  <AspectRatio ratio={1}>
                    <img
                      src={p.featuredImage?.url || "/placeholder.svg"}
                      alt={p.featuredImage?.altText || `Imagem do produto ${p.title}`}
                      className="h-full w-full object-contain bg-card p-6"
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
                    <Button asChild size="sm" variant="brand">
                      <Link to={`/product/${p.handle}`} aria-label={`Ver detalhes de ${p.title}`}>Ver produto</Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Bloco 1 */}
      <section id="sobre" className="relative w-full py-16 bg-gradient-to-br from-primary/5 via-background to-brand/5">
        <div className="container mx-auto">
          <div className="grid items-center gap-12 md:grid-cols-2 animate-fade-in">
            <div>
              <img
                src="/lovable-uploads/80aa8876-94e5-4233-960f-f1a850dba0e2.png"
                alt="Consumidora apresentando a bebida Suívie Jabuticaba"
                className="w-full h-[420px] md:h-[520px] object-cover"
                loading="lazy"
              />
            </div>
            <article>
              <h2 className="font-playfair text-3xl md:text-4xl font-extrabold tracking-tight text-primary">
                Primeira bebida naturalmente antioxidante do mundo
              </h2>
              <p className="mt-4 text-foreground/80 leading-relaxed max-w-prose">
                Bem-vindo à Suivie Jabuticaba, a PRIMEIRA bebida naturalmente antioxidante do mundo. Combinamos a natureza Brasileira com a qualidade Suíça. Seja para um pré-treino para melhorar as funções do organismo, ou pós a atividade física para recuperar eletrólitos e repor energia, essa bebida contém a magia da Jabutica.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Bloco 2 */}
      <section className="relative w-full py-16 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto">
          <div className="grid items-center gap-12 md:grid-cols-2 animate-fade-in">
            <article className="order-2 md:order-1">
              <h2 className="font-playfair text-3xl md:text-4xl font-extrabold tracking-tight text-brand">
                O melhor do Brasil mantido em segredo, até agora...
              </h2>
              <p className="mt-4 text-foreground/80 leading-relaxed max-w-prose">
                Essa super fruta é uma verdadeira bomba de nutrientes, antioxidantes e polifenóis, que nós combinamos apenas com maçã e um toque de gengibre - e nada mais!
              </p>
            </article>
            <div className="order-1 md:order-2">
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

      {/* Bloco 3 */}
      <section className="relative w-full py-16 bg-gradient-to-br from-brand/5 via-background to-primary/5">
        <div className="container mx-auto">
          <div className="grid items-center gap-12 md:grid-cols-2 animate-fade-in">
            <div>
              <img
                src="/lovable-uploads/7b4ceade-aae9-4b29-8d6d-5c8b74bb2085.png"
                alt="Latas Suívie Jabuticaba em bolsa de juta"
                className="w-full h-[420px] md:h-[520px] object-cover"
                loading="lazy"
              />
            </div>
            <article>
              <h2 className="font-playfair text-3xl md:text-4xl font-extrabold tracking-tight text-primary">
                TRULY FRESH, HONESTLY HEALTHY.
              </h2>
              <p className="mt-4 text-foreground/80 leading-relaxed max-w-prose">
                Suivie é uma deliciosa infusão Suiço-Brasileira transbordando de Jabuticaba e maçãs frescas. Todos os ingredientes 100% naturais nesta bebida de fruta são riquíssimos em antixoxidantes e naturalmente baixos em calorias e açúcar.
              </p>
              <div className="mt-6">
                <Button asChild variant="brand" className="rounded-full px-6 hover-scale">
                  <a href="#produtos" aria-label="Ver produtos Suívie">Compre já</a>
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
