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
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCart());
  }, []);

  useEffect(() => {
    writeCart(items);
  }, [items]);

  const count = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items]);
  const totalAmount = useMemo(
    () => items.reduce((acc, i) => acc + i.priceAmount * i.quantity, 0),
    [items]
  );

  function addItem(newItem: Omit<CartItem, "quantity"> & { quantity?: number }) {
    setItems((prev) => {
      const qty = newItem.quantity ?? 1;
      const existing = prev.find((p) => p.merchandiseId === newItem.merchandiseId);
      if (existing) {
        return prev.map((p) =>
          p.merchandiseId === newItem.merchandiseId
            ? { ...p, quantity: p.quantity + qty }
            : p
        );
      }
      return [...prev, { ...newItem, quantity: qty } as CartItem];
    });
  }

  function removeItem(merchandiseId: string) {
    setItems((prev) => prev.filter((p) => p.merchandiseId !== merchandiseId));
  }

  function setQuantity(merchandiseId: string, quantity: number) {
    setItems((prev) =>
      prev.map((p) => (p.merchandiseId === merchandiseId ? { ...p, quantity } : p))
    );
  }

  function clear() {
    setItems([]);
  }

  const linesForCheckout = useMemo(
    () => items.map((i) => ({ merchandiseId: i.merchandiseId, quantity: i.quantity })),
    [items]
  );

  return { items, addItem, removeItem, setQuantity, clear, count, totalAmount, linesForCheckout };
}
