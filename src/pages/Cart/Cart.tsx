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
import { LocalStorage } from "../../storage";
import { CartService } from "../../service/cart";
import { Cart } from "../../entity/cart";
import Loader2 from "../../assets/loader/Loader2";
import { CartItem } from "../../entity/cart_item";
import { CartItemService } from "../../service/cart_item";
import { User } from "../../entity/user";
import { WishListService } from "../../service/wishlist";
export interface CartProps {
  cartTotal: CartTotalCardProps;
  productsData: any[];
  onCheckout?: () => void;
}

const CartScreen: React.FC<CartProps> = ({
  cartTotal,
  productsData,
  onCheckout,
}) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itemsData, setItemsData] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        let user = await new LocalStorage().getUser();
        if (user?.id) {
          setUser(user);
          await fetchCart();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const fetchCart = async () => {
    try {
      let cartData = await new CartService().getMyCart();
      setCart(cartData);
      setItemsData(cartData.cartItems);
    } catch (error) {
      console.log(error);
    }
  };

  const onContinueShopping = () => {
    navigate("/");
  };

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
      let cartData =
        await new CartService().deleteCartItemFromCartByCartIdandCartItemId(
          cart.id,
          cartItem.id,
        );
      if (cartData?.id) {
        setCart(cartData);
        setItemsData(cartData.cartItems);
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
      if (wishList?.id) {
        await onRemoveItem(cartItem);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader2 />
      ) : (
        <div className="cart-fullscreen-wrapper">
          <div className="cart-page-root">
            <div className="cart-top-nav">
              <div className="cart-breadcrumbs">
                <span
                  className="home"
                  onClick={() => {
                    console.log("Continue shopping");
                    navigate("/");
                  }}
                >
                  Home
                </span>{" "}
                &rsaquo; <span className="current">Cart</span>
              </div>
              <Button
                disabled={false}
                icon={<FiArrowLeft />}
                name="Continue Shopping"
                onClick={() => onContinueShopping}
                height={"45px"}
                fontSize={"18px"}
              />
            </div>

            <div className="cart-header-wrapper">
              <h1 className="cart-page-title">Shopping Cart</h1>
              <span className="cart-item-count">{itemsData?.length} items</span>
            </div>

            <div className="cart-main-layout">
              <div className="cart-items-section">
                {itemsData?.length > 0 ? (
                  <CartItems
                    data={itemsData}
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
                      onClick={onContinueShopping}
                      height={"45px"}
                      fontSize={"18px"}
                    />
                  </div>
                )}
              </div>

              <div className="cart-summary-section">
                <CartTotalCard
                  {...cartTotal}
                  onCheckout={
                    onCheckout ||
                    (() => {
                      console.log("Proceeding to checkout");
                      navigate("/checkout");
                    })
                  }
                />
              </div>
            </div>

            <div className="cart-recommendations-section">
              <div className="carousel-wrapper">
                <Carousel
                  title="Your Wish List"
                  data={productsData}
                  renderItem={(item: any) => (
                    <ProductCardGridSingle product={item} />
                  )}
                />
              </div>

              <div className="carousel-wrapper">
                <Carousel
                  title="You May Also Like"
                  data={productsData}
                  renderItem={(item: any) => (
                    <ProductCardGridSingle product={item} />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartScreen;
