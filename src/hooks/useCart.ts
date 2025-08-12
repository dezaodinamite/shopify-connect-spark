import { useEffect, useMemo, useState } from "react";

export type CartItem = {
  merchandiseId: string;
  title: string;
  priceAmount: number;
  currencyCode: string;
  imageUrl?: string;
  handle?: string;
  quantity: number;
};

const CART_KEY = "suivie_cart_v1";
const CART_UPDATED_EVENT = "suivie_cart_updated";

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCart());
  }, []);

  useEffect(() => {
    // Sincroniza atualizações do carrinho entre componentes/abas
    const onExternal = () => setItems(readCart());
    window.addEventListener("storage", onExternal as any);
    window.addEventListener(CART_UPDATED_EVENT, onExternal as any);
    return () => {
      window.removeEventListener("storage", onExternal as any);
      window.removeEventListener(CART_UPDATED_EVENT, onExternal as any);
    };
  }, []);

  const count = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items]);
  const totalAmount = useMemo(
    () => items.reduce((acc, i) => acc + i.priceAmount * i.quantity, 0),
    [items]
  );

  function addItem(newItem: Omit<CartItem, "quantity"> & { quantity?: number }) {
    setItems((prev) => {
      const qty = newItem.quantity ?? 1;
      const existing = prev.find((p) => p.merchandiseId === newItem.merchandiseId);
      const next = existing
        ? prev.map((p) =>
            p.merchandiseId === newItem.merchandiseId
              ? { ...p, quantity: p.quantity + qty }
              : p
          )
        : [...prev, { ...newItem, quantity: qty } as CartItem];
      writeCart(next);
      return next;
    });
  }

  function removeItem(merchandiseId: string) {
    setItems((prev) => {
      const next = prev.filter((p) => p.merchandiseId !== merchandiseId);
      writeCart(next);
      return next;
    });
  }

  function setQuantity(merchandiseId: string, quantity: number) {
    setItems((prev) => {
      const next = prev.map((p) => (p.merchandiseId === merchandiseId ? { ...p, quantity } : p));
      writeCart(next);
      return next;
    });
  }

  function clear() {
    setItems(() => {
      const next: CartItem[] = [];
      writeCart(next);
      return next;
    });
  }

  const linesForCheckout = useMemo(
    () => items.map((i) => ({ merchandiseId: i.merchandiseId, quantity: i.quantity })),
    [items]
  );

  return { items, addItem, removeItem, setQuantity, clear, count, totalAmount, linesForCheckout };
}
