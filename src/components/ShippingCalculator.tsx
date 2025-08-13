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
        <div className="mt-3 rounded-md border p-3">
          {options.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma opção disponível.</p>
          ) : (
            <ul className="space-y-2">
              {options.map((opt) => (
                <li key={opt.handle} className="flex items-center justify-between">
                  <span className="text-sm">{opt.title}</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(opt.amount, opt.currencyCode)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-muted-foreground">Valores e prazos estimados via Shopify/Frenet.</p>
        </div>
      )}
    </div>
  );
}
