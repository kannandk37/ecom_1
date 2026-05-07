import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { Cart } from "../../entity/cart";
import { CartItem } from "../../entity/cart_item";

interface CartContextValue {
  cart: Cart | null;
  setCart: (cart: Cart | null) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  applyPromocode: (code: string) => void;
  removePromocode: () => void;
  clearCart: () => void;
  totalItems: number; // derived: sum of all quantities
  totalPrice: number; // derived: sum of price × quantity (uses variant price if available)
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function calcTotals(cart: Cart | null): {
  totalItems: number;
  totalPrice: number;
} {
  if (!cart?.cartItems?.length) return { totalItems: 0, totalPrice: 0 };
  const totalItems = cart.cartItems.reduce(
    (sum, i) => sum + (i.quantity ?? 0),
    0,
  );
  const totalPrice = cart.cartItems.reduce((sum, i) => {
    const price = i.variant?.price ?? i.product?.price ?? 0;
    return sum + price * (i.quantity ?? 0);
  }, 0);
  return { totalItems, totalPrice };
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCartState] = useState<Cart | null>(null);

  const setCart = useCallback((c: Cart | null) => {
    setCartState(c);
  }, []);

  // Add item — if same id already exists, increment its quantity
  const addToCart = useCallback((item: CartItem) => {
    setCartState((prev) => {
      if (!prev) {
        return { cartItems: [item], isActive: true };
      }
      const exists = prev.cartItems?.find((i) => i.id === item.id);
      if (exists) {
        return {
          ...prev,
          cartItems: prev.cartItems!.map((i) =>
            i.id === item.id
              ? { ...i, quantity: (i.quantity ?? 0) + (item.quantity ?? 1) }
              : i,
          ),
        };
      }
      return { ...prev, cartItems: [...(prev.cartItems ?? []), item] };
    });
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCartState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        cartItems: prev.cartItems?.filter((i) => i.id !== cartItemId) ?? [],
      };
    });
  }, []);

  // Update quantity — if quantity <= 0, remove the item
  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    setCartState((prev) => {
      if (!prev) return null;
      if (quantity <= 0) {
        return {
          ...prev,
          cartItems: prev.cartItems?.filter((i) => i.id !== cartItemId) ?? [],
        };
      }
      return {
        ...prev,
        cartItems:
          prev.cartItems?.map((i) =>
            i.id === cartItemId ? { ...i, quantity } : i,
          ) ?? [],
      };
    });
  }, []);

  const applyPromocode = useCallback((code: string) => {
    setCartState((prev) => (prev ? { ...prev, appliedPromocode: code } : null));
  }, []);

  const removePromocode = useCallback(() => {
    setCartState((prev) =>
      prev ? { ...prev, appliedPromocode: undefined } : null,
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartState((prev) =>
      prev ? { ...prev, cartItems: [], appliedPromocode: undefined } : null,
    );
  }, []);

  // Derived totals — recalculated only when cart changes
  const { totalItems, totalPrice } = useMemo(() => calcTotals(cart), [cart]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      setCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      applyPromocode,
      removePromocode,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [
      cart,
      setCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      applyPromocode,
      removePromocode,
      clearCart,
      totalItems,
      totalPrice,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
