import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import CartTotalCard, {
  CartTotalCardProps,
} from "../../pages/CartTotalCard/CardTotalCard";
import { Carousel } from "../../assets/CarouselTest/CarouselTest";
import "./Card.css";
import { Button } from "../../assets/button/Button";
import ProductCardGridSingle from "../../assets/ProductCardGridSingle/ProductCardGridSingle";
import { useNavigate } from "react-router-dom";
import CartItems, { CartItem } from "../../assets/cart/cartitems/CartItems";

export interface CartProps {
  items: CartItem[];
  cartTotal: CartTotalCardProps;
  productsData: any[];
  onContinueShopping?: () => void;
  onCheckout?: () => void;
  onRemoveItem?: (id: string) => void;
}

const Cart: React.FC<CartProps> = ({
  items = [],
  cartTotal,
  productsData,
  onContinueShopping,
  onCheckout,
  onRemoveItem,
}) => {
  const itemCount = items.length;
  const navigate = useNavigate();

  return (
    <div className="cart-fullscreen-wrapper">
      <div className="cart-page-root">
        <div className="cart-top-nav">
          <div className="breadcrumbs">
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
          <span className="cart-item-count">{itemCount} items</span>
        </div>

        <div className="cart-main-layout">
          <div className="cart-items-section">
            {itemCount > 0 ? (
              <CartItems data={items} onRemove={onRemoveItem} />
            ) : (
              <div className="empty-cart-message">
                <p>Your cart is currently empty.</p>
                <Button
                  disabled={false}
                  icon={<FiArrowLeft />}
                  name="Continue Shopping"
                  onClick={() =>
                    onContinueShopping ||
                    (() => {
                      console.log("Continue shopping");
                      navigate("/");
                    })
                  }
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
  );
};

export default Cart;
