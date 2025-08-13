import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import QuantityInput from "@/components/QuantityInput";
import { useIsMobile } from "@/hooks/use-mobile";
import { Trash2 } from "lucide-react";

const currency = (amount: number, currencyCode: string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: currencyCode || "BRL" }).format(amount);

export function CartSheetTrigger({ children }: { children: React.ReactNode }) {
  const { items, removeItem, setQuantity, totalAmount, linesForCheckout } = useCart();
  const isMobile = useIsMobile();

  async function checkout() {
    const { data, error } = await supabase.functions.invoke("shopify-checkout", {
      body: { lines: linesForCheckout },
    });
    if (error) {
      console.error(error);
      return;
    }
    const url = (data as any)?.data?.cartCreate?.cart?.checkoutUrl as string | undefined;
    if (url) window.location.href = url;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "w-full rounded-t-2xl pt-4 pb-6 px-4" : "w-full sm:max-w-md"}>
        <SheetHeader>
          <SheetTitle>Seu carrinho</SheetTitle>
        </SheetHeader>
        <div className={isMobile ? "mt-4 space-y-3 max-h-[50vh] overflow-y-auto overflow-x-hidden pr-1" : "mt-4 space-y-3 overflow-x-hidden"}>
          {items.length === 0 ? (
            <p className="text-muted-foreground">Seu carrinho está vazio.</p>
          ) : (
            items.map((i) => (
               <div key={i.merchandiseId} className="grid grid-cols-[auto,1fr,auto] items-center gap-3 border rounded-xl p-3 bg-card shadow-soft">
                 {i.imageUrl && (
                   <img
                     src={i.imageUrl}
                     alt={i.title}
                     className="w-[72px] h-[72px] md:w-16 md:h-16 object-cover rounded-lg shrink-0"
                     loading="lazy"
                   />
                 )}
                <div className="min-w-0 pr-2">
                  <div className="font-medium line-clamp-2">{i.title}</div>
                  <div className="text-sm font-semibold text-foreground mt-1">
                    {currency(i.priceAmount, i.currencyCode)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <QuantityInput
                    value={i.quantity}
                    onChange={(newQty) => setQuantity(i.merchandiseId, newQty)}
                    min={1}
                    max={99}
                    size="sm"
                    className="w-auto"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(i.merchandiseId)}
                    aria-label="Remover item do carrinho"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remover</span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        <SheetFooter className="mt-6">
          {items.length > 0 && (
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>{currency(totalAmount, items[0]?.currencyCode || "BRL")}</span>
              </div>
              <Button className="w-full" onClick={checkout} variant="brand">Finalizar compra</Button>
              <p className="text-xs text-muted-foreground text-center opacity-75 mt-2">
                Checkout seguro processado pelo Shopify
              </p>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
