import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Hero from "@/components/Hero";
import ProductSkeleton from "@/components/ProductSkeleton";
import QuantityInput from "@/components/QuantityInput";
import AddToCartIcon from "@/components/AddToCartIcon";
import { useCart } from "@/hooks/useCart";
import { toast } from "@/hooks/use-toast";

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
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { addItem } = useCart();

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
      // Initialize quantities for all products
      const initialQuantities: { [key: string]: number } = {};
      nodes.forEach(product => {
        initialQuantities[product.id] = 1;
      });
      setQuantities(initialQuantities);
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


  // Function to add product to cart
  const addToCart = (product: ProductNode, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const variantId = product.variants?.nodes?.[0]?.id;
    if (!variantId || !product.priceRange) return;
    
    const quantity = quantities[product.id] || 1;
    const { amount, currencyCode } = product.priceRange.minVariantPrice;
    
    addItem({
      merchandiseId: variantId,
      title: product.title,
      priceAmount: parseFloat(amount),
      currencyCode,
      imageUrl: product.featuredImage?.url,
      handle: product.handle,
      quantity: quantity,
    });
    
    toast({
      title: "Adicionado ao carrinho",
      description: `${quantity}x ${product.title}`,
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
  };

  return (
    <main className="min-h-screen bg-background">
      <header>
        <Hero />
      </header>

      <section id="produtos" className="container mx-auto py-16 px-4 md:py-20">
        <header className="mb-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-primary mb-4">Nossos Produtos</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Descubra a linha completa Suívie Jabuticaba - sabor autêntico e qualidade premium</p>
        </header>
        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {products.slice(0, 3).map((p) => (
              <Link key={p.id} to={`/product/${p.handle}`} className="group block">
                <div className="bg-background border border-border rounded-lg soft-transition hover:translate-y-[-2px] h-full overflow-hidden">
                  <div className="relative">
                    <AspectRatio ratio={1}>
                      <img
                        src={p.featuredImage?.url || "/placeholder.svg"}
                        alt={p.featuredImage?.altText || `Imagem do produto ${p.title}`}
                        className="h-full w-full object-contain bg-secondary/30 p-6 radius-lg"
                        loading="lazy"
                      />
                    </AspectRatio>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg line-clamp-2 text-foreground">{p.title}</h3>
                      <p className="text-muted-foreground line-clamp-2 text-sm">{p.description}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="text-xl font-bold text-foreground">
                        {currency(parseFloat(p.priceRange?.minVariantPrice.amount || "0"), p.priceRange?.minVariantPrice.currencyCode || "BRL")}
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <QuantityInput
                            value={quantities[p.id] || 1}
                            onChange={(newQty) => updateQuantity(p.id, newQty)}
                            min={1}
                            max={99}
                            className="flex-shrink-0 w-24"
                          />
                        </div>
                        <Button 
                          variant="brand" 
                          className="mx-auto w-fit text-sm px-4 py-2 h-10" 
                          onClick={(e) => addToCart(p, e)}
                        >
                          <AddToCartIcon className="h-4 w-4" />
                          Adicionar ao Carrinho
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Primeira bebida naturalmente antioxidante do mundo</h2>
              <p className="text-muted-foreground leading-relaxed">
                Bem-vindo à Suívie Jabuticaba, a PRIMEIRA bebida naturalmente antioxidante do mundo. Combinamos a natureza Brasileira com a qualidade Suíça.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Seja para um pré-treino para melhorar as funções do organismo, ou pós a atividade física para recuperar eletrólitos e repor energia, essa bebida contém a magia da Jabuticaba.
              </p>
            </div>
            <div className="relative">
              <img
                src="/lovable-uploads/afd87f4b-f8d6-4012-8360-6bcc57920347.png"
                alt="Consumidora apresentando a bebida Suívie Jabuticaba"
                className="radius-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative md:order-2 order-2">
              <img
                src="/lovable-uploads/13500a28-1b95-404c-b935-d463f3030c4e.png"
                alt="Jabuticabas - super fruta rica em antioxidantes"
                className="radius-lg"
                loading="lazy"
              />
            </div>
            <div className="space-y-6 md:order-1 order-1">
              <h2 className="text-3xl font-bold text-foreground">O melhor do Brasil mantido em segredo, até agora...</h2>
              <p className="text-muted-foreground leading-relaxed">
                Essa super fruta é uma verdadeira bomba de nutrientes, antioxidantes e polifenóis, que nós combinamos apenas com maçã e um toque de gengibre - e nada mais!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="md:py-20 py-0">
        <div className="container mx-auto md:px-4 px-0">
          <div className="mx-auto max-w-3xl bg-foreground text-background md:rounded-full rounded-none shadow-soft text-center px-6 py-12 space-y-6 w-full md:w-auto">
            <h2 className="text-3xl font-bold">TRULY FRESH, HONESTLY HEALTHY.</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Suívie é uma deliciosa infusão Suiço-Brasileira transbordando de Jabuticaba e maçãs frescas.
            </p>
            <div className="pt-2">
              <Button size="lg" variant="brand" className="text-lg px-8 py-3">
                Experimente agora
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
