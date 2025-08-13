import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/hooks/useCart";
import { ProductImageZoom } from "@/components/ProductImageZoom";
import { toast } from "@/hooks/use-toast";
import { ShippingCalculator } from "@/components/ShippingCalculator";
import QuantityInput from "@/components/QuantityInput";
import AddToCartIcon from "@/components/AddToCartIcon";
import Breadcrumbs from "@/components/Breadcrumbs";

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
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
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

  // Build images list and set defaults when product changes
  const images = useMemo(() => {
    const list: { url: string; alt: string }[] = [];
    if (product?.featuredImage?.url) {
      list.push({ url: product.featuredImage.url, alt: product.featuredImage.altText || product.title });
    }
    product?.images?.nodes?.forEach((n) => {
      if (!list.find((i) => i.url === n.url)) list.push({ url: n.url, alt: n.altText || product!.title });
    });
    return list;
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const firstAvailable = product.variants?.nodes?.find((v) => v.availableForSale)?.id || product.variants?.nodes?.[0]?.id || null;
    setSelectedVariant(firstAvailable ?? null);
    setActiveImage(images[0]?.url || null);

    // SEO basics for product page
    const title = `${product.title} | Suívie Jabuticaba`;
    document.title = title;

    const tmp = document.createElement("div");
    tmp.innerHTML = product.descriptionHtml || "";
    const desc = (tmp.textContent || "").trim().slice(0, 150);

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
  }, [product, images]);

  const priceText = useMemo(() => {
    if (!product?.priceRange) return "";
    const { amount, currencyCode } = product.priceRange.minVariantPrice;
    return currency(parseFloat(amount), currencyCode);
  }, [product]);

  function addToCart() {
    const variantId = selectedVariant || product?.variants?.nodes?.[0]?.id;
    if (!product || !variantId) return;
    const { amount, currencyCode } = product.priceRange!.minVariantPrice;
    addItem({
      merchandiseId: variantId,
      title: product.title,
      priceAmount: parseFloat(amount),
      currencyCode,
      imageUrl: activeImage || product.featuredImage?.url,
      handle: product.handle,
      quantity: qty,
    });
    toast({
      title: "Adicionado ao carrinho",
      description: `${qty}x ${product.title}`,
    });
  }

  const selectedVariantAvailable = useMemo(() => {
    if (!product || !selectedVariant) return true;
    return !!product.variants?.nodes?.find((v) => v.id === selectedVariant)?.availableForSale;
  }, [product, selectedVariant]);

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto py-10">
        <Breadcrumbs />
        {loading ? (
          <p className="text-muted-foreground">Carregando…</p>
        ) : !product ? (
          <p>Produto não encontrado.</p>
        ) : (
          <article className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              {activeImage && (
                <ProductImageZoom 
                  src={activeImage} 
                  alt={product.featuredImage?.altText || product.title}
                  images={images}
                  currentIndex={images.findIndex(img => img.url === activeImage)}
                  onImageChange={(index) => setActiveImage(images[index]?.url)}
                />
              )}

              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-2 px-4">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img.url)}
                      className={`rounded-none overflow-hidden border focus:outline-none focus:ring-2 focus:ring-ring hover:border-primary transition-colors ${
                        activeImage === img.url ? "ring-2 ring-primary" : ""
                      }`}
                      aria-label={`Ver imagem ${idx + 1} do produto`}
                    >
                      <img src={img.url} alt={img.alt} className="h-20 w-full object-contain bg-card p-1 rounded-none" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className="font-playfair text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                {product.title}
              </h1>

              <div className="mt-3 flex items-center gap-3">
                <p className="text-2xl font-semibold">{priceText}</p>
                <Badge variant="secondary" className="rounded-full text-white">{selectedVariantAvailable ? "Em estoque" : "Indisponível"}</Badge>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge className="bg-[hsl(var(--shipping-green))] hover:bg-foreground font-medium px-3 py-1 text-sm transition-colors" style={{borderRadius: '999px', color: 'white !important'}}>Envio Full Armazenaí</Badge>
                <Badge className="bg-[hsl(var(--shipping-blue))] hover:bg-foreground font-medium px-3 py-1 text-sm transition-colors" style={{borderRadius: '999px', color: 'white !important'}}>Frete Same-Day Disponível</Badge>
                <Badge className="bg-[hsl(var(--shipping-orange))] hover:bg-foreground font-medium px-3 py-1 text-sm transition-colors" style={{borderRadius: '999px', color: 'white !important'}}>Frete Next-Day Disponível</Badge>
              </div>

              {product.variants?.nodes && product.variants.nodes.length > 1 && (
                <div className="mt-5">
                  <label className="block text-sm text-muted-foreground mb-1">Variação</label>
                  <Select value={selectedVariant ?? undefined} onValueChange={(v) => setSelectedVariant(v)}>
                    <SelectTrigger className="w-full md:w-72">
                      <SelectValue placeholder="Selecione a variação" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.variants.nodes.map((v) => (
                        <SelectItem key={v.id} value={v.id} disabled={!v.availableForSale}>
                          {v.title} {v.availableForSale ? "" : "– indisponível"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="mt-8 flex items-center gap-3">
                <QuantityInput
                  value={qty}
                  onChange={setQty}
                  min={1}
                  max={99}
                  className="w-auto"
                />
                <Button onClick={addToCart} variant="brand" disabled={!selectedVariantAvailable} className="flex items-center gap-2">
                  <AddToCartIcon size={16} />
                  Adicionar ao carrinho
                </Button>
              </div>

              <div className="mt-4">
                <ShippingCalculator lines={selectedVariant ? [{ merchandiseId: selectedVariant, quantity: qty }] : []} />
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none mt-8" dangerouslySetInnerHTML={{ __html: product.descriptionHtml || "" }} />
            </div>
          </article>
        )}
      </section>
    </main>
  );
}
