import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
  const [addingToCart, setAddingToCart] = useState<{ [key: string]: boolean }>({});
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
  const addToCart = async (product: ProductNode, e: React.MouseEvent, customQuantity?: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const variantId = product.variants?.nodes?.[0]?.id;
    if (!variantId || !product.priceRange) return;
    
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    const quantity = customQuantity || quantities[product.id] || 1;
    const { amount, currencyCode } = product.priceRange.minVariantPrice;
    
    try {
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
    } finally {
      setTimeout(() => {
        setAddingToCart(prev => ({ ...prev, [product.id]: false }));
      }, 1000);
    }
  };

  // Quick add function for floating button
  const quickAdd = (product: ProductNode, e: React.MouseEvent) => {
    addToCart(product, e, 1);
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
          <div className="grid auto-rows-fr gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <ul className="grid auto-rows-fr gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto" role="list">
            {products.slice(0, 3).map((p) => (
              <li key={p.id} className="h-full">
                <Card className="group h-full flex flex-col ring-1 ring-border hover:ring-primary/20 focus-within:ring-primary/30 transition-all duration-300 hover:shadow-lg">
                  <div className="relative">
                    <Link to={`/product/${p.handle}`} className="block">
                      <AspectRatio ratio={4/5}>
                        <img
                          src={p.featuredImage?.url || "/placeholder.svg"}
                          alt={p.featuredImage?.altText || `Imagem do produto ${p.title}`}
                          className="h-full w-full object-contain bg-secondary/30 p-4 radius-lg transition-transform duration-300 group-hover:scale-[1.02]"
                          loading="lazy"
                          decoding="async"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      </AspectRatio>
                    </Link>
                    {/* Quick Add Floating Button */}
                    <button
                      type="button"
                      onClick={(e) => quickAdd(p, e)}
                      disabled={addingToCart[p.id]}
                      className="absolute top-3 right-3 w-10 h-10 bg-background/90 hover:bg-background border border-border rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50"
                      aria-label={`Adicionar rapidamente ${p.title} ao carrinho`}
                      title="Adicionar rapidamente ao carrinho"
                    >
                      {addingToCart[p.id] ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <img 
                          src="/lovable-uploads/4ab52ae0-6ad5-4cc3-b5e3-108dc3cde084.png" 
                          alt="Adicionar" 
                          className="h-4 w-4 object-contain opacity-80 hover:opacity-100 transition-opacity"
                        />
                      )}
                    </button>
                  </div>
                  <CardContent className="flex-1 min-h-[120px] space-y-4 pt-6">
                    <div className="space-y-2">
                      <Link
                        to={`/product/${p.handle}`}
                        className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm"
                        aria-label={`Ver detalhes de ${p.title}`}
                      >
                        <h3 className="font-semibold text-lg line-clamp-2 text-foreground">{p.title}</h3>
                      </Link>
                      <p className="text-muted-foreground line-clamp-2 text-sm">{p.description}</p>
                    </div>
                    <div className="text-xl font-bold text-foreground">
                      {currency(
                        parseFloat(p.priceRange?.minVariantPrice.amount || "0"),
                        p.priceRange?.minVariantPrice.currencyCode || "BRL"
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-border/50 flex flex-col gap-3 pt-4">
                    <div className="flex items-center gap-2 w-full">
                      <QuantityInput
                        value={quantities[p.id] || 1}
                        onChange={(newQty) => updateQuantity(p.id, newQty)}
                        min={1}
                        max={99}
                        className="flex-shrink-0"
                        aria-label={`Quantidade de ${p.title}`}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="brand"
                      className="w-full text-sm px-4 py-2 h-11 gap-2"
                      onClick={(e) => addToCart(p, e)}
                      disabled={addingToCart[p.id]}
                      aria-label={`Adicionar ${quantities[p.id] || 1} unidade${(quantities[p.id] || 1) > 1 ? 's' : ''} de ${p.title} ao carrinho`}
                    >
                      {addingToCart[p.id] ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Adicionando...
                        </>
                      ) : (
                        <>
                          <AddToCartIcon className="h-4 w-4" />
                          Adicionar ao Carrinho
                        </>
                      )}
                    </Button>
                    <Link
                      to={`/product/${p.handle}`}
                      className="text-xs text-muted-foreground hover:text-foreground underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm"
                    >
                      Ver detalhes do produto
                    </Link>
                  </CardFooter>
                </Card>
              </li>
            ))}
          </ul>
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
      <section className="md:py-20 py-0 md:mb-0 mb-0">
        <div className="container mx-auto md:px-4 px-0 md:mb-0 -mb-0">
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
