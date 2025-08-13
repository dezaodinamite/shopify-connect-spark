import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export type ShippingLine = { merchandiseId: string; quantity: number };

type Option = {
  handle: string;
  title: string;
  amount: number;
  currencyCode: string;
};

function formatCurrency(amount: number, currencyCode = "BRL") {
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: currencyCode }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
}

export function ShippingCalculator({ lines, className }: { lines: ShippingLine[]; className?: string }) {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Option[] | null>(null);

  async function calculate() {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      toast("Informe um CEP válido com 8 dígitos");
      return;
    }
    if (!lines || lines.length === 0) {
      toast("Selecione um produto e quantidade para calcular");
      return;
    }
    setLoading(true);
    setOptions(null);
    try {
      const { data, error } = await supabase.functions.invoke("shopify-shipping", {
        body: { postalCode: digits, lines },
      });
      if (error) throw error;
      const opts = (data as any)?.options as Option[] | undefined;
      if (!opts || opts.length === 0) {
        toast("Não encontramos opções de frete para este CEP");
        setOptions([]);
      } else {
        setOptions(opts);
      }
    } catch (e: any) {
      console.error(e);
      toast("Erro ao calcular frete. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      void calculate();
    }
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-48">
          <label htmlFor="cep" className="mb-1 block text-sm text-muted-foreground">
            Calcular frete (CEP)
          </label>
          <Input
            id="cep"
            inputMode="numeric"
            placeholder="00000-000"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="CEP para calcular frete"
          />
        </div>
        <Button onClick={calculate} disabled={loading} className="sm:self-end bg-foreground text-background hover:bg-foreground/90">
          {loading ? "Calculando…" : "Calcular frete"}
        </Button>
      </div>

      {options && (
        <div className="mt-4 space-y-3">
          {options.length === 0 ? (
            <div className="rounded-lg border border-border p-4 text-center">
              <p className="text-sm text-muted-foreground">Nenhuma opção disponível.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {options.map((opt, index) => (
                  <div 
                    key={opt.handle} 
                    className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{opt.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {index === 0 ? "Entrega padrão" : "Entrega expressa"}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-foreground">
                      {formatCurrency(opt.amount, opt.currencyCode)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Valores e prazos estimados via Shopify/Frenet.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
