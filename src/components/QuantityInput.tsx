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
  const decrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (value > min) {
      onChange(value - 1);
    }
  };

  const increase = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className={`inline-flex items-center bg-background border border-border rounded-lg overflow-hidden ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={decrease}
        disabled={value <= min}
        className="h-9 w-9 p-0 rounded-none border-0 hover:bg-secondary/50 disabled:opacity-30 transition-colors"
        aria-label="Diminuir quantidade"
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <div className="flex-1 text-center px-4 py-2 min-w-[3rem] text-sm font-medium bg-background border-x border-border">
        {value}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={increase}
        disabled={value >= max}
        className="h-9 w-9 p-0 rounded-none border-0 hover:bg-secondary/50 disabled:opacity-30 transition-colors"
        aria-label="Aumentar quantidade"
      >
        <img 
          src="/lovable-uploads/4ab52ae0-6ad5-4cc3-b5e3-108dc3cde084.png" 
          alt="Adicionar" 
          className="h-4 w-4 object-contain opacity-80 hover:opacity-100 transition-opacity"
        />
      </Button>
    </div>
  );
}