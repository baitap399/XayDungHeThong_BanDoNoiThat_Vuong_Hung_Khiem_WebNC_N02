import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { cartApi } from '../api/services';
import type { Cart } from '../api/types';
import { useAuth } from './AuthContext';

interface CartContextValue {
  cart: Cart | null;
  loading: boolean;
  refresh: () => Promise<void>;
  add: (productId: number, quantity?: number) => Promise<void>;
  update: (productId: number, quantity: number) => Promise<void>;
  remove: (productId: number) => Promise<void>;
  clear: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!user) { setCart(null); return; }
    setLoading(true);
    try { setCart((await cartApi.get()).data); } finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, [user?.id]);

  const value = useMemo<CartContextValue>(() => ({
    cart, loading, refresh,
    async add(productId, quantity = 1) { setCart((await cartApi.add(productId, quantity)).data); },
    async update(productId, quantity) { setCart((await cartApi.update(productId, quantity)).data); },
    async remove(productId) { setCart((await cartApi.remove(productId)).data); },
    async clear() { setCart((await cartApi.clear()).data); },
  }), [cart, loading]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used inside CartProvider');
  return value;
}
