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
    <div className={`flex items-center border rounded-lg ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={decrease}
        disabled={value <= min}
        className="h-8 w-8 rounded-r-none border-r"
        aria-label="Diminuir quantidade"
      >
        <Minus className="h-3 w-3" />
      </Button>
      <div className="flex-1 text-center px-3 py-1 min-w-[2.5rem] text-sm font-medium">
        {value}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={increase}
        disabled={value >= max}
        className="h-8 w-8 rounded-l-none border-l"
        aria-label="Aumentar quantidade"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}