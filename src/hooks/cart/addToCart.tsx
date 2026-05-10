// hooks/useAddToCart.ts
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
import { LocalStorage } from "../../storage";
import { CartItem } from "../../entity/cart_item";

export interface AddToCartOptions {
  onAuthRequired?: () => void; // caller controls auth modal
  onSuccess?: () => void; // caller decides — navigate, show modal, etc.
  showToast: (opts: ToastOptions) => void; // caller passes their toast method
}

export interface ToastOptions {
  type: "success" | "error" | "warning" | "info";
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface UseAddToCartReturn {
  handleAddToCart: (
    product: any,
    quantity?: number,
    variant?: any,
  ) => Promise<void>;
  handlePostLoginAddToCart: () => void;
  isAddingToCart: boolean;
  addedProductId: string | null;
  isInCart: (productId: string) => boolean;
  getCartQuantity: (productId: string) => number;
}

export const useAddToCart = ({
  onAuthRequired,
  onSuccess,
  showToast,
}: AddToCartOptions): UseAddToCartReturn => {
  const navigate = useNavigate();
  const { cart, isHydrated, cartError, clearCartError, addToCart } = useCart();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // ── Toast watcher — handles ALL cart action errors, not just addToCart ────
  useEffect(() => {
    if (!cartError) return;

    switch (cartError.action) {
      case "addToCart":
        showToast({
          type: "error",
          message: cartError.message,
          action: {
            label: "Retry",
            onClick: () => {
              // re-trigger is handled by caller re-calling handleAddToCart
            },
          },
        });
        break;
      case "removeFromCart":
        showToast({ type: "error", message: cartError.message });
        break;
      case "updateQuantity":
        showToast({ type: "error", message: cartError.message });
        break;
      case "clearCart":
        showToast({ type: "error", message: cartError.message });
        break;
      default:
        showToast({ type: "error", message: cartError.message });
    }

    clearCartError();
  }, [cartError]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const isInCart = (productId: string): boolean => {
    return cart?.cartItems?.some((i) => i.product?.id === productId) ?? false;
  };

  const getCartQuantity = (productId: string): number => {
    return (
      cart?.cartItems?.find((i) => i.product?.id === productId)?.quantity ?? 0
    );
  };

  // ── Core handler ──────────────────────────────────────────────────────────

  const handleAddToCart = async (
    product: any,
    quantity: number = 1,
    variant: any = null,
  ) => {
    // Case 1: Not hydrated
    if (!isHydrated) {
      showToast({
        type: "warning",
        message: "Cart is loading, please try again.",
      });
      return;
    }

    // Case 2: Not logged in
    const user = await new LocalStorage().getUser();
    if (!user?.id) {
      onAuthRequired?.(); // caller opens their own auth modal
      return;
    }

    // Case 3: Bad product data
    if (!product?.id) {
      showToast({
        type: "error",
        message:
          "Product information is missing. Please refresh and try again.",
      });
      return;
    }

    // Case 4: Out of stock
    if (product.stock !== undefined && product.stock <= 0) {
      showToast({
        type: "warning",
        message: "This product is currently out of stock.",
      });
      return;
    }

    // Case 5: Quantity exceeds stock
    if (product.stock !== undefined && quantity > product.stock) {
      showToast({
        type: "warning",
        message: `Only ${product.stock} units available.`,
      });
      return;
    }

    // Case 6: Already adding
    if (isAddingToCart) return;

    // Case 7: Already in cart
    if (isInCart(product.id)) {
      showToast({
        type: "info",
        message: `${product.title} is already in your cart.`,
        action: { label: "View Cart", onClick: () => navigate("/cart") },
      });
      return;
    }

    // ── All guards passed ─────────────────────────────────────────────────
    setIsAddingToCart(true);
    setAddedProductId(product.id);

    try {
      const cartItem = new CartItem();
      cartItem.product = product;
      cartItem.variant = variant;
      cartItem.quantity = quantity;

      await addToCart(cartItem);

      showToast({
        type: "success",
        message: `${product.title} added to cart!`,
        action: { label: "View Cart", onClick: () => navigate("/cart") },
      });

      onSuccess?.();
    } catch (error) {
      // Safety net — context already handles rollback + cartError
      console.error("Unexpected error in handleAddToCart:", error);
      showToast({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsAddingToCart(false);
      setAddedProductId(null);
    }
  };

  // ── Post-login retry ──────────────────────────────────────────────────────
  const handlePostLoginAddToCart = () => {
    setTimeout(() => handleAddToCart, 300);
  };

  return {
    handleAddToCart,
    handlePostLoginAddToCart,
    isAddingToCart,
    addedProductId,
    isInCart,
    getCartQuantity,
  };
};
