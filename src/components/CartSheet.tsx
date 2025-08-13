import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import QuantityInput from "@/components/QuantityInput";

const currency = (amount: number, currencyCode: string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: currencyCode || "BRL" }).format(amount);

export function CartSheetTrigger({ children }: { children: React.ReactNode }) {
  const { items, removeItem, setQuantity, totalAmount, linesForCheckout } = useCart();

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
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Seu carrinho</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-muted-foreground">Seu carrinho está vazio.</p>
          ) : (
            items.map((i) => (
               <div key={i.merchandiseId} className="flex items-center gap-4 border rounded-xl p-3 bg-card shadow-soft">
                 {i.imageUrl && (
                   <img src={i.imageUrl} alt={i.title} className="w-16 h-16 object-cover rounded-xl" loading="lazy" />
                 )}
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{i.title}</div>
                  <div className="text-sm text-muted-foreground">{currency(i.priceAmount, i.currencyCode)}</div>
                </div>
                <QuantityInput
                  value={i.quantity}
                  onChange={(newQty) => setQuantity(i.merchandiseId, newQty)}
                  min={1}
                  max={99}
                  className="w-auto"
                />
                <Button variant="ghost" onClick={() => removeItem(i.merchandiseId)}>Remover</Button>
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
