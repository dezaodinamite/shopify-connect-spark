import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
  "aria-label"?: string;
}

export default function QuantityInput({ 
  value, 
  onChange, 
  min = 1, 
  max = 99,
  size = "md",
  className = "",
  "aria-label": ariaLabel
}: QuantityInputProps) {
  const btnSize = size === "sm" ? "h-10 w-10" : "h-11 w-11";
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault();
      if (value < max) onChange(value + 1);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault();
      if (value > min) onChange(value - 1);
    }
  };

  return (
    <div 
      className={`flex items-center justify-center bg-background border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-primary/50 w-fit mx-auto ${className}`}
      role="spinbutton"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={ariaLabel || "Quantidade do produto"}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={decrease}
        disabled={value <= min}
        className={`${btnSize} p-0 rounded-none border-0 hover:bg-secondary/50 disabled:opacity-30 transition-colors touch-target`}
        aria-label="Diminuir quantidade"
        type="button"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <div className="flex-1 text-center px-3 py-2 min-w-[3rem] text-sm font-medium bg-background border-x border-border">
        {value}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={increase}
        disabled={value >= max}
        className={`${btnSize} p-0 rounded-none border-0 hover:bg-secondary/50 disabled:opacity-30 transition-colors touch-target`}
        aria-label="Aumentar quantidade"
        type="button"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}