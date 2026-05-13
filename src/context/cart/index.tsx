import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
  useEffect,
} from "react";
import { Cart } from "../../entity/cart";
import { CartItem } from "../../entity/cart_item";
import { LocalStorage } from "../../storage";
import { CartService } from "../../service/cart";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CartError {
  action: "addToCart" | "removeFromCart" | "updateQuantity" | "clearCart";
  message: string;
  _id: number;
}

interface CartContextValue {
  cart: Cart | null;
  isHydrated: boolean;
  cartError: CartError | null;
  clearCartError: () => void;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  applyPromocode: (code: string) => void;
  removePromocode: () => void;
  clearCart: () => Promise<void>;
  setCart: (cart: Cart | null) => void;
  totalItems: number;
  totalPrice: number;
}

// ─── Module-level singletons ─────────────────────────────────────────────────

const ls = new LocalStorage();
const cartService = new CartService();
let errorCount = 0;

// ─── Pure helpers ─────────────────────────────────────────────────────────────

function calcTotals(cart: Cart | null): {
  totalItems: number;
  totalPrice: number;
} {
  if (!cart?.cartItems?.length) return { totalItems: 0, totalPrice: 0 };
  return {
    totalItems: cart.cartItems.length,
    totalPrice: cart.cartItems.reduce((sum, i) => {
      const price = i.variant?.price ?? i.product?.price ?? 0;
      return sum + price * (i.quantity ?? 0);
    }, 0),
  };
}

function persist(cart: Cart | null): void {
  try {
    if (cart) ls.storeCart(cart);
    else ls.clearCart();
  } catch {
    // localStorage quota exceeded or private mode — in-memory state still correct
  }
}

function applyAddToCart(prev: Cart | null, item: CartItem): Cart {
  if (!prev) return { cartItems: [item], isActive: true };
  const exists = prev.cartItems?.find((i) => i.id === item.id);
  return exists
    ? {
        ...prev,
        cartItems: prev.cartItems!.map((i) =>
          i.id === item.id
            ? { ...i, quantity: (i.quantity ?? 0) + (item.quantity ?? 1) }
            : i,
        ),
      }
    : { ...prev, cartItems: [...(prev.cartItems ?? []), item] };
}

function applyRemoveFromCart(
  prev: Cart | null,
  cartItemId: string,
): Cart | null {
  if (!prev) return null;
  return {
    ...prev,
    cartItems: prev.cartItems?.filter((i) => i.id !== cartItemId) ?? [],
  };
}

function applyUpdateQuantity(
  prev: Cart | null,
  cartItemId: string,
  quantity: number,
): Cart | null {
  if (!prev) return null;
  return quantity <= 0
    ? {
        ...prev,
        cartItems: prev.cartItems?.filter((i) => i.id !== cartItemId) ?? [],
      }
    : {
        ...prev,
        cartItems:
          prev.cartItems?.map((i) =>
            i.id === cartItemId ? { ...i, quantity } : i,
          ) ?? [],
      };
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCartState] = useState<Cart | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [cartError, setCartError] = useState<CartError | null>(null);

  const inFlight = useRef<Set<string>>(new Set());
  const quantityTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  // ✅ Fix 3 — tracks latest quantity per item for debounce
  const pendingQuantities = useRef<Map<string, number>>(new Map());

  // Sync ref — always current cart, never stale in async callbacks
  const cartRef = useRef<Cart | null>(null);
  cartRef.current = cart;

  // ─── Mount ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const stored = await ls.getCart();
        if (stored && !cancelled) setCartState(stored);
      } catch {
        // Corrupt localStorage — start fresh
      } finally {
        if (!cancelled) setIsHydrated(true);
      }

      try {
        const token = await ls.getToken();
        if (!token) return; // ✅ skip re-validate if not logged in
        // TODO: to call cart only logged in user is customer
      
        const fresh = await cartService.getMyCart();
        if (fresh && !cancelled) {
          setCartState(fresh);
          persist(fresh);
        }
      } catch {
        // Network down or session expired — localStorage cart stands
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // ─── Tab sync ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== "cart") return;
      if (inFlight.current.size > 0) return;
      if (!e.newValue) {
        setCartState(null);
        return;
      }
      try {
        setCartState(JSON.parse(e.newValue) as Cart);
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ─── Cleanup timers on unmount ───────────────────────────────────────────
  useEffect(() => {
    return () => {
      quantityTimers.current.forEach((t) => clearTimeout(t));
      quantityTimers.current.clear();
      pendingQuantities.current.clear();
    };
  }, []);

  // ─── Error emitter ───────────────────────────────────────────────────────
  const emitError = useCallback(
    (action: CartError["action"], message: string) => {
      setCartError({ action, message, _id: ++errorCount });
    },
    [],
  );

  const clearCartError = useCallback(() => setCartError(null), []);

  // ─── Network helper ──────────────────────────────────────────────────────
  // ✅ Fix 4
  const assertOnline = useCallback(
    (action: CartError["action"]): boolean => {
      if (!navigator.onLine) {
        emitError(
          action,
          "You're offline. Please check your connection and try again.",
        );
        return false;
      }
      return true;
    },
    [emitError],
  );

  // ─── setCart ─────────────────────────────────────────────────────────────
  const setCart = useCallback((c: Cart | null) => {
    setCartState(c);
    persist(c);
  }, []);

  // ─── addToCart ───────────────────────────────────────────────────────────
  const addToCart = useCallback(
    async (item: CartItem) => {
      if (!item.product?.id && !item.id) {
        emitError("addToCart", "Invalid item — missing product.");
        return;
      }

      // ✅ Fix 4 — offline check
      if (!assertOnline("addToCart")) return;

      const itemKey = item.id ?? item.product?.id ?? "unknown";
      if (inFlight.current.has(`add:${itemKey}`)) return;
      inFlight.current.add(`add:${itemKey}`);

      const snapshot = cartRef.current;
      const optimistic = applyAddToCart(snapshot, item);
      setCartState(optimistic);
      persist(optimistic);

      try {
        const confirmed = await cartService.create({ cartItems: [item] });
        setCartState(confirmed);
        persist(confirmed);
      } catch (error: any) {
        setCartState(snapshot);
        persist(snapshot);
        emitError(
          "addToCart",
          error?.response?.data?.message ??
            "Failed to add item. Please try again.",
        );
      } finally {
        inFlight.current.delete(`add:${itemKey}`);
      }
    },
    [emitError, assertOnline],
  );

  // ─── removeFromCart ──────────────────────────────────────────────────────
  const removeFromCart = useCallback(
    async (cartItemId: string) => {
      if (!cartItemId) {
        emitError("removeFromCart", "Invalid item.");
        return;
      }

      // ✅ Fix 5 — cart must exist and have an id before remove
      if (!cartRef.current?.id) {
        emitError("removeFromCart", "Cart not initialised yet.");
        return;
      }

      // ✅ Fix 4
      if (!assertOnline("removeFromCart")) return;

      if (inFlight.current.has(`remove:${cartItemId}`)) return;
      inFlight.current.add(`remove:${cartItemId}`);

      const snapshot = cartRef.current;
      const optimistic = applyRemoveFromCart(snapshot, cartItemId);
      setCartState(optimistic);
      persist(optimistic);

      try {
        const confirmed =
          await cartService.deleteCartItemFromCartByCartIdandCartItemId(
            cartRef.current?.id ?? "",
            cartItemId,
          );
        setCartState(confirmed);
        persist(confirmed);
      } catch (error: any) {
        setCartState(snapshot);
        persist(snapshot);
        emitError(
          "removeFromCart",
          error?.response?.data?.message ??
            "Failed to remove item. Please try again.",
        );
      } finally {
        inFlight.current.delete(`remove:${cartItemId}`);
      }
    },
    [emitError, assertOnline],
  );

  // ─── updateQuantity ──────────────────────────────────────────────────────
  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      if (!cartItemId) return;

      // ✅ Fix 5 — cart must exist and have an id
      if (!cartRef.current?.id) {
        emitError("updateQuantity", "Cart not initialised yet.");
        return;
      }

      const safeQuantity = Math.max(0, Math.floor(quantity));

      // ✅ Fix 3 — always store latest quantity before debounce fires
      pendingQuantities.current.set(cartItemId, safeQuantity);

      // Optimistic fires immediately on every tap
      const optimistic = applyUpdateQuantity(
        cartRef.current,
        cartItemId,
        safeQuantity,
      );
      setCartState(optimistic);
      persist(optimistic);

      if (quantityTimers.current.has(cartItemId)) {
        clearTimeout(quantityTimers.current.get(cartItemId)!);
      }

      quantityTimers.current.set(
        cartItemId,
        setTimeout(async () => {
          quantityTimers.current.delete(cartItemId);

          // ✅ Fix 3 — read latest quantity at fire time, not tap time
          const finalQuantity =
            pendingQuantities.current.get(cartItemId) ?? safeQuantity;
          pendingQuantities.current.delete(cartItemId);

          // ✅ Fix 4 — offline check at actual API fire time
          if (!navigator.onLine) {
            const snapshot = cartRef.current;
            setCartState(snapshot);
            persist(snapshot);
            emitError(
              "updateQuantity",
              "You're offline. Please check your connection.",
            );
            return;
          }

          if (inFlight.current.has(`qty:${cartItemId}`)) return;
          inFlight.current.add(`qty:${cartItemId}`);

          // ✅ Snapshot at fire time — correct rollback target
          const snapshot = cartRef.current;

          try {
            if (finalQuantity <= 0) {
              const confirmed =
                await cartService.deleteCartItemFromCartByCartIdandCartItemId(
                  cartRef.current?.id ?? "",
                  cartItemId,
                );
              setCartState(confirmed);
              persist(confirmed);
            }
            // TODO: wire updateQuantity endpoint
            // const confirmed = await cartService.updateQuantity(cartItemId, finalQuantity);
            // setCartState(confirmed); persist(confirmed);
          } catch (error: any) {
            setCartState(snapshot);
            persist(snapshot);
            emitError(
              "updateQuantity",
              error?.response?.data?.message ??
                "Failed to update quantity. Please try again.",
            );
          } finally {
            inFlight.current.delete(`qty:${cartItemId}`);
          }
        }, 600),
      );
    },
    [emitError],
  );

  // ─── applyPromocode ──────────────────────────────────────────────────────
  const applyPromocode = useCallback((code: string) => {
    if (!code?.trim()) return;
    setCartState((prev) => {
      if (!prev) return null;
      const next = { ...prev, appliedPromocode: code.trim() };
      persist(next);
      return next;
    });
  }, []);

  // ─── removePromocode ─────────────────────────────────────────────────────
  const removePromocode = useCallback(() => {
    setCartState((prev) => {
      if (!prev) return null;
      const next = { ...prev, appliedPromocode: undefined as any };
      persist(next);
      return next;
    });
  }, []);

  // ─── clearCart ───────────────────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    // ✅ Fix 5 — cart must exist and have an id
    if (!cartRef.current?.id) {
      emitError("clearCart", "Cart not initialised yet.");
      return;
    }

    // ✅ Fix 4
    if (!assertOnline("clearCart")) return;

    if (inFlight.current.has("clear")) return;
    inFlight.current.add("clear");

    const snapshot = cartRef.current;
    const optimistic = snapshot
      ? {
          ...snapshot,
          cartItems: [] as CartItem[],
          appliedPromocode: undefined as any,
        }
      : null;
    setCartState(optimistic);
    persist(optimistic);

    try {
      await cartService.clearMyCart();
    } catch (error: any) {
      setCartState(snapshot);
      persist(snapshot);
      emitError(
        "clearCart",
        error?.response?.data?.message ??
          "Failed to clear cart. Please try again.",
      );
    } finally {
      inFlight.current.delete("clear");
    }
  }, [emitError, assertOnline]);

  // ─── Derived ─────────────────────────────────────────────────────────────
  const { totalItems, totalPrice } = useMemo(() => calcTotals(cart), [cart]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      isHydrated,
      cartError,
      clearCartError,
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
      isHydrated,
      cartError,
      clearCartError,
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
