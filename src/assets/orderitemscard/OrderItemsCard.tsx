import React from "react";
import "./OrderItemsCard.css";
import { TiArrowSync } from "react-icons/ti";
import {
  FaArrowRightLong,
  FaIndianRupeeSign,
  FaLocationDot,
} from "react-icons/fa6";
import DashboardButton from "../ui/DashBoardButton/DashBoardButton";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { CiCalendarDate } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

export interface OrderItem {
  id: string;
  status: "Delivered" | "In Process" | "Pending Payment";
  date: string;
  totalPrice: string;
  address: string;
  itemThumbnails: string[];
  itemDescription?: string;
}

export interface OrderItemsProps {
  orders: OrderItem[];
}

const OrderItems: React.FC<OrderItemsProps> = ({ orders }) => {
  const navigate = useNavigate();

  return (
    <div className="order-items-main-container">
      {orders.map((order) => (
        <div key={order.id} className="order-item-card-wrapper">
          <div className="order-item-card">
            <div className="order-left-content">
              <div className="order-card-header">
                <h3 className="order-id-text">{order.id}</h3>
                <span
                  className={`order-status-tag status-${order.status.toLowerCase().replace(/ /g, "-")}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="order-date-price-row">
                <div className="order-detail-item">
                  <span
                    role="img"
                    aria-label="calendar"
                    className="order-info-icon"
                  >
                    <CiCalendarDate />
                  </span>
                  <p className="order-detail-text">{order.date}</p>
                </div>
                <div className="order-detail-item">
                  <span
                    role="img"
                    aria-label="rupee"
                    className="order-info-icon"
                  >
                    <FaIndianRupeeSign />
                  </span>
                  <p className="order-detail-text order-total-price">
                    {order.totalPrice}
                  </p>
                </div>
              </div>

              <div className="order-detail-item">
                <span
                  role="img"
                  aria-label="map-pin"
                  className="order-info-icon"
                >
                  <FaLocationDot />
                </span>
                <p className="order-detail-text order-address-text">
                  <strong>Shipped Address:</strong> {order.address}
                </p>
              </div>

              <div className="order-items-preview-group">
                <div className="order-thumbnails-list">
                  {order.itemThumbnails.slice(0, 2).map((thumb, index) => (
                    <div key={index} className="order-thumbnail-item">
                      <img
                        src={thumb}
                        alt={`item-${index}`}
                        className="item-thumbnail-image"
                      />
                    </div>
                  ))}
                  {order.itemThumbnails.length > 2 && (
                    <span className="plus-items-count">
                      +{order.itemThumbnails.length - 2} items
                    </span>
                  )}
                </div>
                {order.itemDescription && (
                  <p className="order-single-item-desc">
                    {order.itemDescription}
                  </p>
                )}
              </div>
            </div>

            <div className="order-right-actions">
              <DashboardButton
                width={"130px"}
                variant="secondary"
                icon={<TiArrowSync />}
                name="Reorder"
                onClick={() => {}}
              />
              {order.status === "Pending Payment" && (
                <DashboardButton
                  width={"225px"}
                  variant="outline"
                  icon={<RiMoneyRupeeCircleFill />}
                  name="Complete Payment"
                  onClick={() => {}}
                />
              )}
              <DashboardButton
                width={"190px"}
                variant="primary"
                icon={<FaArrowRightLong />}
                name="View Details"
                onClick={() => {
                  console.log("123");
                  navigate(`/order/:123`);
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderItems;
