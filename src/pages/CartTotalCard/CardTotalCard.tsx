import React from "react";
import "./CardTotalCard.css";
import DashboardButton from "../../assets/ui/DashBoardButton/DashBoardButton";
import { FaArrowRightLong, FaCircleCheck } from "react-icons/fa6";

export interface CartTotalCardProps {
  subtotal: string;
  shipping: string;
  discountCode?: string; // Optional: "FESTIVE10" from reference
  discountAmount?: string; // Optional: "-$10.00" from reference
  finalTotal: string;
  onCheckout: () => void; // Callback for checkout button
}
const CartTotalCard: React.FC<CartTotalCardProps> = ({
  subtotal,
  shipping,
  discountCode,
  discountAmount,
  finalTotal,
  onCheckout,
}) => {
  return (
    <div className="cart-total-card-container">
      <div className="cart-total-header-row">
        <h2 className="cart-total-title">Cart Total</h2>
      </div>

      <div className="cart-price-item-list">
        <div className="cart-price-item">
          <span className="cart-price-label">Subtotal</span>
          <span className="cart-price-value">{subtotal}</span>
        </div>
        <div className="cart-price-item">
          <span className="cart-price-label">Shipping</span>
          <span className="cart-price-value shipping-value">{shipping}</span>
        </div>

        {discountCode && discountAmount && (
          <div className="cart-price-item applied-discount-section">
            <span className="cart-price-label">Discount</span>
            <div className="discount-applied-details">
              <span className="discount-code-tag">{discountCode}</span>
              <span className="cart-price-value discount-amount-value">
                {discountAmount}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="cart-final-total-section">
        <div className="cart-price-item final-total-row">
          <span className="cart-final-total-label">Final Total</span>
          <span className="cart-final-total-value">{finalTotal}</span>
        </div>
        <div className="cart-final-subtext-row">
          <span className="checkmark-container">
            <FaCircleCheck />
          </span>
          <p className="cart-final-subtext">
            Shipping, Promocode & taxes calculated at checkout
          </p>
        </div>
      </div>

      <div className="cart-total-footer">
        <DashboardButton
          onClick={onCheckout}
          icon={<FaArrowRightLong />}
          name="Proceed to Checkout"
        />
      </div>
    </div>
  );
};

export default CartTotalCard;
