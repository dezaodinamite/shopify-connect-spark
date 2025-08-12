import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { ShippingCalculator } from "@/components/ShippingCalculator";
import QuantityInput from "@/components/QuantityInput";

const currency = (amount: number, currencyCode: string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: currencyCode || "BRL" }).format(amount);

export default function CartPage() {
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
    <main className="min-h-screen bg-background">
      <section className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Seu carrinho</h1>
        {items.length === 0 ? (
          <p className="text-muted-foreground">Seu carrinho está vazio.</p>
        ) : (
          <div className="grid gap-6">
            {items.map((i) => (
               <div key={i.merchandiseId} className="flex items-center gap-4 border rounded-2xl p-4">
                 {i.imageUrl && (
                   <img src={i.imageUrl} alt={i.title} className="w-20 h-20 object-cover rounded-2xl" />
                 )}
                <div className="flex-1">
                  <div className="font-medium">{i.title}</div>
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
            ))}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-lg font-semibold">Total</div>
              <div className="text-lg font-semibold">{currency(totalAmount, items[0]?.currencyCode || "BRL")}</div>
            </div>
            <div className="grid gap-3">
              <div className="border rounded-2xl p-4">
                <h2 className="font-medium mb-2">Calcular frete</h2>
                <ShippingCalculator lines={linesForCheckout} />
              </div>
              <div className="flex justify-end">
                <Button onClick={checkout}>Finalizar compra</Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
