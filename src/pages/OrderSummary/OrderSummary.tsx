import React from "react";
import "./OrderSummary.css";
import DashboardButton from "../../assets/ui/DashBoardButton/DashBoardButton";

interface OrderSummaryProps {
  items: any[];
  subtotal: number;
  shipping: number;
  tax: number;
  buttonText: string;
  onButtonClick: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  shipping,
  tax,
  buttonText,
  onButtonClick,
}) => {
  const total = subtotal + shipping + tax;

  return (
    <div className="order-summary-card">
      <h2 className="summary-title">Order Summary</h2>

      {/* SCROLLABLE ITEM LIST */}
      <div className="summary-items-list">
        {items.map((item, index) => (
          <div key={index} className="summary-item">
            <img src={item.image} alt={item.name} className="item-thumb" />
            <div className="item-details">
              <span className="item-name">{item.name}</span>
              <span className="item-qty">
                {item.quantity} x {item.weight}
                {item.unit}
              </span>
            </div>
            <span className="item-price">₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      {/* STATIC TOTALS SECTION */}
      <div className="summary-totals">
        <div className="total-row">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="total-row">
          <span>Shipping</span>
          <span className="free-tag">
            {shipping === 0 ? "FREE" : `₹${shipping}`}
          </span>
        </div>
        <div className="total-row">
          <span>Estimated Tax</span>
          <span>₹{tax}</span>
        </div>
        <div className="total-divider" />
        <div className="total-row final">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <DashboardButton name={buttonText} onClick={onButtonClick} />
        {/* <button className="summary-action-btn" onClick={onButtonClick}>
          {buttonText}
        </button> */}
      </div>
    </div>
  );
};

export default OrderSummary;
