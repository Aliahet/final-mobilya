'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductVariant, CartItem } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variant?: ProductVariant | null, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  updateQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'final-mobilya-cart';

function getItemPrice(item: CartItem): number {
  const base = item.product.discount_price ?? item.product.base_price;
  const modifier = item.variant?.price_modifier ?? 0;
  return base + modifier;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, variant?: ProductVariant | null, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && (item.variant?.id ?? null) === (variant?.id ?? null)
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [...prev, { product, variant: variant ?? null, quantity }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string, variantId?: string | null) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && (item.variant?.id ?? null) === (variantId ?? null))
      )
    );
  };

  const updateQuantity = (productId: string, variantId: string | null, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && (item.variant?.id ?? null) === (variantId ?? null)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
