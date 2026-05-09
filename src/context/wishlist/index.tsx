import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { Wishlist } from "../../entity/wishlist";

interface WishlistContextValue {
  wishlists: Wishlist[];
  setWishlists: (items: Wishlist[]) => void;
  addToWishlist: (item: Wishlist) => void;
  removeFromWishlist: (wishlistId: string) => void;
  isInWishlist: (productId: string, variantId?: string) => boolean;
  clearWishlist: () => void;
  totalWishlistItems: number;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [wishlists, setWishlistsState] = useState<Wishlist[]>([]);

  const setWishlists = useCallback((items: Wishlist[]) => {
    setWishlistsState(items);
  }, []);

  const addToWishlist = useCallback((item: Wishlist) => {
    setWishlistsState((prev) => {
      const exists = prev.some(
        (w) =>
          w.product?.id === item.product?.id &&
          (w.variant?.id ?? "") === (item.variant?.id ?? ""),
      );
      if (exists) return prev;
      return [...prev, item];
    });
  }, []);

  const removeFromWishlist = useCallback((wishlistId: string) => {
    setWishlistsState((prev) => prev.filter((w) => w.id !== wishlistId));
  }, []);

  const isInWishlist = useCallback(
    (productId: string, variantId?: string, wishlistId?: string): boolean => {
      if (wishlistId) {
        return wishlists.some((w) => w.id === wishlistId);
      } else {
        return wishlists.some(
          (w) =>
            w.product?.id === productId &&
            (w.variant?.id ?? "") === (variantId ?? ""),
        );
      }
    },
    [wishlists],
  );

  const clearWishlist = useCallback(() => {
    setWishlistsState([]);
  }, []);

  const totalWishlistItems = useMemo(() => wishlists.length, [wishlists]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      wishlists,
      setWishlists,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      totalWishlistItems,
    }),
    [
      wishlists,
      setWishlists,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      totalWishlistItems,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx)
    throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
