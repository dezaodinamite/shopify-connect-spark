import { Button } from "@/components/ui/button";
import QuantityInput from "@/components/QuantityInput";
import AddToCartIcon from "@/components/AddToCartIcon";

interface MobileStickyCartBarProps {
  title: string;
  priceText: string;
  quantity: number;
  onQuantityChange: (value: number) => void;
  onAdd: () => void;
  disabled?: boolean;
}

export default function MobileStickyCartBar({
  title,
  priceText,
  quantity,
  onQuantityChange,
  onAdd,
  disabled = false,
}: MobileStickyCartBarProps) {
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border shadow-lg pb-[env(safe-area-inset-bottom)]">
      <div className="container mx-auto py-3 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground truncate">{title}</p>
          <p className="text-lg font-semibold text-foreground leading-tight">{priceText}</p>
        </div>
        <QuantityInput
          value={quantity}
          onChange={onQuantityChange}
          min={1}
          max={99}
          className="w-auto"
          aria-label="Quantidade"
        />
        <Button
          onClick={onAdd}
          variant="brand"
          size="sm"
          disabled={disabled}
          className="flex items-center gap-2"
          aria-label="Adicionar ao carrinho"
        >
          <AddToCartIcon size={16} />
          Adicionar
        </Button>
      </div>
    </div>
  );
}
