import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

interface Product {
  id: string;
  title: string;
  handle: string;
  descriptionHtml?: string;
  featuredImage?: { url: string; altText?: string } | null;
  images?: { nodes: { url: string; altText?: string }[] };
  priceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
  variants?: { nodes: { id: string; title: string; availableForSale: boolean }[] };
}

const currency = (amount: number, currencyCode: string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: currencyCode || "BRL" }).format(amount);

export default function ProductPage() {
  const { handle } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    if (!handle) return;
    (async () => {
      const { data, error } = await supabase.functions.invoke("shopify-products", {
        body: { action: "getProduct", handle },
      });
      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }
      const p = (data as any)?.data?.product as Product | undefined;
      setProduct(p ?? null);
      setLoading(false);
    })();
  }, [handle]);

  const priceText = useMemo(() => {
    if (!product?.priceRange) return "";
    const { amount, currencyCode } = product.priceRange.minVariantPrice;
    return currency(parseFloat(amount), currencyCode);
  }, [product]);

  function addToCart() {
    const variantId = product?.variants?.nodes?.[0]?.id;
    if (!product || !variantId) return;
    const { amount, currencyCode } = product.priceRange!.minVariantPrice;
    addItem({
      merchandiseId: variantId,
      title: product.title,
      priceAmount: parseFloat(amount),
      currencyCode,
      imageUrl: product.featuredImage?.url,
      handle: product.handle,
      quantity: qty,
    });
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto py-10">
        {loading ? (
          <p className="text-muted-foreground">Carregando…</p>
        ) : !product ? (
          <p>Produto não encontrado.</p>
        ) : (
          <article className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {product.featuredImage?.url && (
                <img
                  src={product.featuredImage.url}
                  alt={product.featuredImage?.altText || product.title}
                  className="w-full rounded-lg object-cover"
                />
              )}
              {product.images?.nodes && product.images.nodes.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {product.images.nodes.slice(1).map((img, idx) => (
                    <img key={idx} src={img.url} alt={img.altText || product.title} className="w-full h-20 object-cover rounded" loading="lazy" />
                  ))}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <p className="text-xl font-semibold mb-4">{priceText}</p>
              <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: product.descriptionHtml || "" }} />

              <div className="mt-6 flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  className="w-20 border rounded h-10 px-3 bg-background"
                />
                <Button onClick={addToCart} disabled={!product.variants?.nodes?.[0]?.id}>Adicionar ao carrinho</Button>
              </div>
            </div>
          </article>
        )}
      </section>
    </main>
  );
}
