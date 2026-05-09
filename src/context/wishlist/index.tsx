import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Wishlist } from '../../entity/wishlist';


interface WishlistContextValue {
  wishlist:        Wishlist[];
  setWishlist:     (items: Wishlist[]) => void;
  addToWishlist:   (item: Wishlist) => void;
  removeFromWishlist: (wishlistId: string) => void;
  isInWishlist:    (productId: string, variantId?: string) => boolean;
  clearWishlist:   () => void;
  totalWishlistItems: number;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlistState] = useState<Wishlist[]>([]);

  const setWishlist = useCallback((items: Wishlist[]) => {
    setWishlistState(items);
  }, []);

  const addToWishlist = useCallback((item: Wishlist) => {
    setWishlistState((prev) => {
      const exists = prev.some(
        (w) =>
          w.product?.id === item.product?.id &&
          (w.variant?.id ?? '') === (item.variant?.id ?? '')
      );
      if (exists) return prev; 
      return [...prev, item];
    });
  }, []);

  const removeFromWishlist = useCallback((wishlistId: string) => {
    setWishlistState((prev) => prev.filter((w) => w.id !== wishlistId));
  }, []);

  const isInWishlist = useCallback(
    (productId: string, variantId?: string): boolean => {
      return wishlist.some(
        (w) =>
          w.product?.id === productId &&
          (w.variant?.id ?? '') === (variantId ?? '')
      );
    },
    [wishlist]
  );

  const clearWishlist = useCallback(() => {
    setWishlistState([]);
  }, []);

  const totalWishlistItems = useMemo(() => wishlist.length, [wishlist]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      wishlist,
      setWishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      totalWishlistItems,
    }),
    [
      wishlist,
      setWishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      totalWishlistItems,
    ]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return ctx;
}