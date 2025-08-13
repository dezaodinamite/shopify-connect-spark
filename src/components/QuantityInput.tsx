import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export default function QuantityInput({ 
  value, 
  onChange, 
  min = 1, 
  max = 99,
  className = "" 
}: QuantityInputProps) {
  const decrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const increase = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className={`flex items-center border border-border radius-md soft-transition bg-background overflow-hidden ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={decrease}
        disabled={value <= min}
        className="h-10 w-10 radius-none border-0 border-r border-border flex-shrink-0"
        aria-label="Diminuir quantidade"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <div className="flex-1 text-center px-2 py-2 min-w-[2rem] text-sm font-medium bg-background border-0">
        {value}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={increase}
        disabled={value >= max}
        className="h-10 w-10 radius-none border-0 border-l border-border flex-shrink-0"
        aria-label="Aumentar quantidade"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}