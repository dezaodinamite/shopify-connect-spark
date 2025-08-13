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
    <div className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-background border-t border-border shadow-lg pb-[calc(env(safe-area-inset-bottom)+8px)]">
      <div className="container mx-auto py-3 flex items-center gap-3">
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
