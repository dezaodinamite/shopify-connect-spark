import { ShoppingCart } from "lucide-react";

interface AddToCartIconProps {
  className?: string;
  size?: number;
}

export default function AddToCartIcon({ className = "", size = 16 }: AddToCartIconProps) {
  // Using fallback icon since the image couldn't be downloaded
  return <ShoppingCart className={className} size={size} />;
}