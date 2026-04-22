import React from "react";
import "./OrderStatusScreen.css";
import DashboardButton from "../../assets/ui/DashBoardButton/DashBoardButton";
import { IoMdMailUnread } from "react-icons/io";
import { FaCartShopping, FaCheck, FaCircleCheck } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import { FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Sub-component for icons
const StatusIcon: React.FC<{ type: "success" | "failure" }> = ({ type }) => {
  if (type === "success") {
    return (
      <div className="status-badge status-badge--success">
        <FaCircleCheck size={50} />
      </div>
    );
  }
  return (
    <div className="status-badge status-badge--failure">
      <FaTimesCircle size={50} />
    </div>
  );
};

// Main Component Props
interface OrderData {
  orderNumber: string;
  estimatedDeliveryRange: string;
  items: { thumbnailUrl: string; name: string }[];
  totalItems: number;
  userEmail: string;
  failureReason?: string;
}

interface OrderStatusScreenProps {
  orderStatus: "success" | "failure";
  orderData: OrderData;
}

const OrderStatusScreen: React.FC<OrderStatusScreenProps> = ({
  orderStatus = "success",
  orderData,
}) => {
  const {
    orderNumber,
    estimatedDeliveryRange,
    items,
    totalItems,
    userEmail,
    failureReason,
  } = orderData;
  const navigate = useNavigate();
  const title =
    orderStatus === "success" ? "Order Placed Successfully!" : "Order Failed";
  const description =
    orderStatus === "success"
      ? "Thank you for your purchase. Your organic collection is being prepared."
      : "We encountered an issue with your order. Dont worry your cart items are safe.";

  return (
    <div className="order-status-screen">
      <div className="order-status-container">
        <div className="header-section">
          <StatusIcon type={orderStatus} />
          <h1 className="status-title">{title}</h1>
          <p className="status-description">{description}</p>
        </div>

        {orderStatus === "failure" && failureReason && (
          <div className="failure-reason-card">
            <span className="label">Reason for Failure</span>
            <p className="reason-text">{failureReason}</p>
          </div>
        )}
        {orderStatus === "success" && (
          <>
            <div className="data-cards-grid">
              <div className="data-card">
                <span className="label">ORDER NUMBER</span>
                <span className="value">{orderNumber}</span>
              </div>
              <div className="data-card">
                <span className="label">ESTIMATED DELIVERY</span>
                <span className="value">{estimatedDeliveryRange}</span>
              </div>
            </div>

            <div className="item-section">
              <div className="item-section__header">
                <h3>Curated Items ({totalItems})</h3>
                <a
                  className="item-section__receipt-link"
                    onClick={(e) => {
                      e.preventDefault(); // 👈 this is what was missing
                      navigate('/receipt');
                    }}
                >
                  View Receipt
                </a>
              </div>
              <div className="item-section__items-grid">
                {items.map((item, index) => (
                  <img
                    key={index}
                    src={item.thumbnailUrl}
                    alt={item.name}
                    className="thumbnail"
                  />
                ))}
              </div>
            </div>
          </>
        )}
        <div className="buttons-container">
          {orderStatus == "success" ? (
            <DashboardButton
              name="Continue Shopping"
              variant="primary"
              icon={<FaCartShopping />}
              onClick={() => {
                navigate("/");
              }}
            />
          ) : (
            <DashboardButton
              name="Cart"
              variant="primary"
              icon={<FaCartShopping />}
              onClick={() => {
                navigate("/cart");
              }}
            />
          )}
        </div>

        <div className="footer-email">
          <IoMdMailUnread />
          <p>A confirmation email has been sent to {userEmail}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusScreen;
