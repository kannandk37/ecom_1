import React, { FC } from "react";
import "./Order.css";
import {
  IoMdBook,
  IoMdPin,
  IoMdCard,
  IoMdDocument,
  IoMdClock,
  IoMdEye,
} from "react-icons/io";
import { FaCheck, FaGooglePay } from "react-icons/fa";
import { BsCashStack, BsFillBoxSeamFill } from "react-icons/bs";
import { TiArrowSync } from "react-icons/ti";
import { MdLocalShipping } from "react-icons/md";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { FiCreditCard } from "react-icons/fi";
import { TbReceiptFilled } from "react-icons/tb";
import DashBoardButton from "../../assets/ui/DashBoardButton/DashBoardButton";
import { IoEye } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Button from "../../assets/button/Button";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

interface OrderedItem {
  name: string;
  variant: string;
  quantity: number;
  price: number;
  thumbnail: string;
}

interface ShippingAddress {
  name: string;
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface PaymentInfo {
  method: string;
  transactionId: string;
  date: string;
}

interface OrderSummaryItem {
  label: string;
  value: number;
  isTotal?: boolean;
}

export interface OrderProps {
  orderNumber: string;
  orderDate: string;
  status: string; // E.g., 'Delivered'
  items: OrderedItem[];
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  summary: OrderSummaryItem[];
}

export const Order: FC<OrderProps> = ({
  orderNumber,
  orderDate,
  status,
  items,
  shippingAddress,
  paymentInfo,
  summary,
}) => {
  const navigate = useNavigate();
  const deliveredBadge = (
    <div className="order-status-badge status-delivered">
      <FaCheck />
      <span>{status}</span>
    </div>
  );

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <div className="order-root-container">
      <div className="order-content-wrapper">
        <Button
          icon={<FaArrowLeftLong />}
          disabled={false}
          variant="primary"
          name="Back"
          onClick={() => {
            navigate("/orders");
          }}
        />
        <div className="order-header">
          <div className="order-header-row">
            <div className="order-title-group">
              <h1 className="order-title">Order #{orderNumber}</h1>
              {status === "Delivered" && deliveredBadge}
            </div>
            <p className="order-date-label">October 24, 2023 at 10:42 AM</p>
          </div>

          <div className="order-actions-row">
            <DashBoardButton
              width={"190px"}
              icon={<TiArrowSync />}
              variant="primary"
              name="Reorder All"
              onClick={() => {}}
            />
            <DashBoardButton
              width={"190px"}
              icon={<IoEye />}
              variant="outline"
              name="View Receipt"
              onClick={() => {
                navigate("/receipt");
              }}
            />
          </div>
        </div>

        <div className="order-card-container items-ordered-card">
          <div className="order-card-header">
            <BsFillBoxSeamFill />
            <h2 className="section-title">Items Ordered</h2>
          </div>
          <div className="order-card-body items-list">
            {items.map((item, index) => (
              <div key={index} className="ordered-item-row">
                {/* <RiMoneyRupeeCircleFill /> */}
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="item-thumbnail"
                />
                <div className="item-details">
                  <p className="item-name">{item.name}</p>
                  <p className="item-variant">Variant: {item.variant}</p>
                  <p className="item-qty">Qty: {item.quantity}</p>
                </div>
                <p className="item-price">{formatCurrency(item.price)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="order-two-column-row">
          <div className="order-card-container shipping-address-card">
            <div className="order-card-header">
              <MdLocalShipping />
              <h2 className="section-title">Shipping Address</h2>
            </div>
            <div className="order-card-body">
              <p className="address-name">{shippingAddress.name}</p>
              <p className="address-line">{shippingAddress.street}</p>
              <p className="address-line">{shippingAddress.apt}</p>
              <p className="address-line">
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.zip}
              </p>
              <p className="address-line">{shippingAddress.country}</p>
            </div>
          </div>

          <div className="order-card-container payment-info-card">
            <div className="order-card-header">
              <FiCreditCard />
              <h2 className="section-title">Payment Information</h2>
            </div>
            <div className="order-card-body payment-list">
              <div className="payment-row">
                <p className="payment-label">Method</p>
                <div className="payment-value method-value">
                  <BsCashStack />
                  <span>Google Pay</span>
                </div>
              </div>
              <div className="payment-row">
                <p className="payment-label">Transaction ID</p>
                <p className="payment-value transaction-id-value">
                  {paymentInfo.transactionId}
                </p>
              </div>
              <div className="payment-row">
                <p className="payment-label">Date</p>
                <p className="payment-value date-value">{paymentInfo.date}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="order-card-container">
          <div className="order-card-header">
            <TbReceiptFilled />
            <h2 className="section-title">Order Summary</h2>
          </div>
          <div className="order-card-body summary-list">
            {summary.map((item, index) => (
              <div
                key={index}
                className={`summary-row ${item.isTotal ? "total-row" : ""}`}
              >
                <p className="summary-label">{item.label}</p>
                <p className="summary-value">{formatCurrency(item.value)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
