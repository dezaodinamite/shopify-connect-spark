import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import QuantityInput from "@/components/QuantityInput";
import AddToCartIcon from "@/components/AddToCartIcon";
import { cn } from "@/lib/utils";
import { Star, Leaf } from "lucide-react";
import { HTMLAttributes, useMemo } from "react";

export interface ProductCardProduct {
  id: string;
  title: string;
  handle: string;
  description?: string;
  featuredImage?: { url: string; altText?: string } | null;
  priceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
}

export interface ProductCardMeta {
  badges?: string[];
  rating?: number; // 0-5
  reviewsCount?: number;
  discountPercent?: number; // e.g., 30 meaning 30%
  overlayText?: string; // small overlay over image
  secondaryImageUrl?: string; // second image, NOT primary
  subtitle?: string; // short supporting line under title
  volumeLabel?: string; // e.g., "269ml"
  highlightText?: string; // informative chip at bottom of image
  gradientFrom?: string; // tailwind from-* class
  gradientTo?: string; // tailwind to-* class
}

export interface ProductCardProps extends HTMLAttributes<HTMLDivElement> {
  product: ProductCardProduct;
  quantity: number;
  onQuantityChange: (newQty: number) => void;
  onAddToCart: (e: React.MouseEvent) => void;
  meta?: ProductCardMeta;
}

const currency = (amount: number, currencyCode: string) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currencyCode || "BRL",
  }).format(amount);

export default function ProductCard({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  meta,
  className,
  ...props
}: ProductCardProps) {
  const baseAmount = parseFloat(
    product.priceRange?.minVariantPrice.amount || "0"
  );
  const currencyCode = product.priceRange?.minVariantPrice.currencyCode || "BRL";

  const { finalPrice, hasDiscount } = useMemo(() => {
    const pct = meta?.discountPercent ?? 0;
    if (pct > 0) {
      const discounted = baseAmount * (1 - pct / 100);
      return { finalPrice: discounted, hasDiscount: true };
    }
    return { finalPrice: baseAmount, hasDiscount: false };
  }, [baseAmount, meta?.discountPercent]);

  const rating = Math.max(0, Math.min(5, meta?.rating ?? 0));

  return (
    <Link to={`/product/${product.handle}`} className="group block">
      <Card className={cn("overflow-hidden h-full", className)} {...props}>
        <div className="relative">
          <AspectRatio ratio={1}>
            <div
              className={cn(
                "relative h-full w-full overflow-hidden bg-gradient-to-br",
                meta?.gradientFrom || "from-jabuticaba-soft",
                meta?.gradientTo || "to-jabuticaba-cream"
              )}
            >
              <img
                src={product.featuredImage?.url || "/placeholder.svg"}
                alt={
                  product.featuredImage?.altText || `Imagem do produto ${product.title}`
                }
                className="h-full w-full object-cover soft-transition duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Secondary image indicator only (does not replace main) */}
              {meta?.secondaryImageUrl ? (
                <img
                  src={meta.secondaryImageUrl}
                  alt={`Segunda imagem de ${product.title}`}
                  className="absolute bottom-3 right-3 h-12 w-12 object-cover rounded-md ring-2 ring-background/80 shadow-md hidden sm:block"
                  loading="lazy"
                />
              ) : null}

              {meta?.overlayText ? (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-3 px-3 py-1.5 radius-pill text-xs bg-foreground/90 text-background shadow soft-transition">
                  {meta.overlayText}
                </div>
              ) : null}

              {/* Top-left badges */}
              {meta?.badges && meta.badges.length > 0 ? (
                <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
                  {meta.badges.map((b, i) => (
                    <Badge key={i} variant={i === 0 ? "default" : "secondary"}>
                      {b}
                    </Badge>
                  ))}
                </div>
              ) : null}

              {/* Top-right volume label */}
              {meta?.volumeLabel ? (
                <div className="absolute top-3 right-3 z-10">
                  <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-foreground shadow">
                    {meta.volumeLabel}
                  </div>
                </div>
              ) : null}

              {/* Bottom highlight chip */}
              {meta?.highlightText ? (
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <div className="bg-gradient-to-br from-jabuticaba-wine to-jabuticaba-purple text-white px-3 py-2 rounded-lg text-xs font-medium text-center backdrop-blur-sm shadow-lg flex items-center justify-center gap-1">
                    <Leaf className="w-3 h-3" />
                    <span>{meta.highlightText}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </AspectRatio>
        </div>

        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2 text-foreground">
              {product.title}
            </h3>
            {meta?.subtitle ? (
              <p className="text-sm text-muted-foreground line-clamp-1">{meta.subtitle}</p>
            ) : null}
            {product.description ? (
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {product.description}
              </p>
            ) : null}
          </div>

          {/* Rating */}
          {meta?.rating ? (
            <div className="flex items-center gap-1 text-highlight-gold">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={cn(
                    "h-4 w-4",
                    idx < Math.round(rating) ? "fill-current" : "opacity-30"
                  )}
                />
              ))}
              {typeof meta?.reviewsCount === "number" && (
                <span className="text-xs text-muted-foreground ml-2">
                  ({meta.reviewsCount})
                </span>
              )}
            </div>
          ) : null}

          <div className="space-y-3">
            {/* Price */}
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-bold text-foreground">
                {currency(finalPrice, currencyCode)}
              </div>
              {hasDiscount ? (
                <div className="text-sm text-muted-foreground line-through">
                  {currency(baseAmount, currencyCode)}
                </div>
              ) : null}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <QuantityInput
                value={quantity}
                onChange={onQuantityChange}
                min={1}
                max={99}
                className="flex-shrink-0 w-24"
              />
              <Button
                variant="brand"
                className="ml-auto text-sm px-4 py-2 h-10"
                onClick={onAddToCart}
              >
                <AddToCartIcon className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
