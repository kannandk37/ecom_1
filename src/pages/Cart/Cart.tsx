import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import CartTotalCard, {
  CartTotalCardProps,
} from "../CartTotalCard/CardTotalCard";
import { Carousel } from "../../assets/Carousel/Carousel";
import "./Cart.css";
import { Button } from "../../assets/button/Button";
import ProductCardGridSingle from "../../assets/ProductCardGridSingle/ProductCardGridSingle";
import { useNavigate } from "react-router-dom";
import CartItems from "../../assets/cart/CartItems";
import Loader2 from "../../assets/loader/Loader2";
import { useCart } from "../../context/cart";
import { useWishlist } from "../../context/wishlist";
import { CartItem } from "../../entity/cart_item";
import { WishListService } from "../../service/wishlist";
import { User } from "../../entity/user";
import { CartItemService } from "../../service/cart_item";
import { CartService } from "../../service/cart";
import { Cart } from "../../entity/cart";
import { Product } from "../../entity/product";
import { ProductService } from "../../service/product";

export interface CartProps {
  cartTotal: CartTotalCardProps;
  onCheckout?: () => void;
}

const CartScreen: React.FC<CartProps> = ({
  cartTotal,
  onCheckout,
}) => {
  const [cartData, setCartData] = useState<Cart>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itemsData, setItemsData] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User>();
  const { setCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const {
    cart,
    isHydrated,
    cartError,
    clearCartError,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromocode,
    removePromocode,
    totalItems,
    totalPrice,
  } = useCart();

  const { wishlists } = useWishlist();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        let productsData = await new ProductService().get();
        if (productsData?.length > 0) {
          setProducts(productsData);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ── Toast watcher — cartError from any action shows here ──────────────────
  useEffect(() => {
    if (!cartError) return;
    // replace with your toast method e.g. toast.error(cartError.message)
    alert(cartError.message);
    clearCartError();
  }, [cartError]);

  // ── Not hydrated yet — show loader ────────────────────────────────────────
  if (!isHydrated) return <Loader2 />;

  const cartItems = cart?.cartItems ?? [];

  const onIncreaseQuantity = async (cartItem: CartItem) => {
    try {
      let updatedCartItem = await new CartItemService().updateById(
        cartItem.id,
        cartItem,
      );
      if (updatedCartItem?.id) {
        setItemsData((prevItems) => {
          return prevItems.map((item) => {
            if (item.id === updatedCartItem.id) {
              return updatedCartItem;
            }
            return item;
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onRemoveItem = async (cartItem: CartItem) => {
    try {
      let cartResponseData =
        await new CartService().deleteCartItemFromCartByCartIdandCartItemId(
          cartData.id,
          cartItem.id,
        );
      if (cartResponseData?.id) {
        console.log("setting again");
        setCartData(cartResponseData);
        setCart(cartResponseData);
        setItemsData(cartResponseData.cartItems);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSaveForLater = async (cartItem: CartItem) => {
    try {
      let wishList = await new WishListService().toggle(
        user.id,
        cartItem.product.id,
        cartItem?.variant?.id ? cartItem?.variant?.id : null,
      );
      console.log(wishList, "wishList");
      if (wishList?.id) {
        console.log("going to reomve");
        await onRemoveItem(cartItem);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="cart-fullscreen-wrapper">
      <div className="cart-page-root">
        <div className="cart-top-nav">
          <div className="cart-breadcrumbs">
            <span onClick={() => navigate("/")}>
              Home
            </span>
            <span>{">"}</span>
            <span className="cart-breadcrumbs-active">Cart</span>
          </div>
          <Button
            disabled={false}
            icon={<FiArrowLeft />}
            name="Continue Shopping"
            onClick={() => navigate("/")}
            height={"45px"}
            fontSize={"18px"}
          />
        </div>

        <div className="cart-header-wrapper">
          <h1 className="cart-page-title">Shopping Cart</h1>
          <span className="cart-item-count">{totalItems} items</span>
        </div>

        <div className="cart-main-layout">
          <div className="cart-items-section">
            {cartItems.length > 0 ? (
              <CartItems
                data={cartItems}
                // ── Remove item ─────────────────────────────────────────
                // CartItems component should call this with the cartItemId
                // onRemove={async (cartItemId: string) => {
                //   await removeFromCart(cartItemId);
                // }}
                // // ── Quantity change ──────────────────────────────────────
                // // CartItems component should call this when +/- tapped
                // // passing 0 auto-removes the item
                // onIncreaseQuantity={async (cartItemId: string, newQty: number) => {
                //   await updateQuantity(cartItemId, newQty);
                // }}
                // onDecreaseQuantity={async (cartItemId: string, newQty: number) => {
                //   await updateQuantity(cartItemId, newQty);
                // }}
                onIncreaseQuantity={onIncreaseQuantity}
                onRemove={onRemoveItem}
                onSaveForLater={onSaveForLater}
              />
            ) : (
              <div className="empty-cart-message">
                <p>Your cart is currently empty.</p>
                <Button
                  disabled={false}
                  icon={<FiArrowLeft />}
                  name="Continue Shopping"
                  onClick={() => navigate("/")}
                  height={"45px"}
                  fontSize={"18px"}
                />
              </div>
            )}
          </div>

          <div className="cart-summary-section">
            <CartTotalCard
              {...cartTotal}
              // Override totals with live context values
              // totalItems={totalItems}
              // totalPrice={totalPrice}
              // appliedPromocode={cart?.appliedPromocode}
              // ── Promo code ─────────────────────────────────────────────
              // onApplyPromocode={(code: string) => applyPromocode(code)}
              // onRemovePromocode={() => removePromocode()}
              // ── Clear cart ─────────────────────────────────────────────
              // onClearCart={async () => await clearCart()}
              onCheckout={onCheckout || (() => navigate("/checkout"))}
            />
          </div>
        </div>

        <div className="cart-recommendations-section">
          {wishlists.length > 0 && (
            <div className="carousel-wrapper">
              <Carousel
                title="Your Wish List"
                data={wishlists.map((w) => w.product)}
                renderItem={(item: any) => (
                  <ProductCardGridSingle product={item} />
                )}
              />
            </div>
          )}

          <div className="carousel-wrapper">
            <Carousel
              title="You May Also Like"
              data={products}
              renderItem={(item: any) => (
                <ProductCardGridSingle product={item} />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
