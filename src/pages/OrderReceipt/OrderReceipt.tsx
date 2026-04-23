import React from "react";
import "./OrderReceipt.css";
import { FaCheck, FaFileDownload } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { TbReceiptFilled } from "react-icons/tb";
import DashboardButton from "../../assets/ui/DashBoardButton/DashBoardButton";

interface OrderItem {
  id: string;
  image: string;
  name: string;
  details: string;
  price: string;
}

interface OrderReceiptProps {
  orderNumber: string;
  date: string;
  status: string;
  shipping: {
    name: string;
    phone: string;
    address: string[];
  };
  payment: {
    method: {
      icon: string; // URL for GPay icon
      text: string;
    };
    transactionId: string;
  };
  items: OrderItem[];
  pricing: {
    subtotal: string;
    discount: {
      code: string;
      value: string;
    };
    shippingFee: string;
    grandTotal: string;
  };
  onDownloadCopy: () => void;
}

const OrderReceipt: React.FC<OrderReceiptProps> = ({
  orderNumber,
  date,
  status,
  shipping,
  payment,
  items,
  pricing,
  onDownloadCopy,
}) => {
  return (
    <div className="receipt-paper">
      {/* Receipt Header */}
      <div className="receipt-header">
        <div className="receipt-logo-section">
          <h1 className="receipt-logo">THE DRY FRUIT CO.</h1>
          <p className="receipt-tagline">PREMIUM MANAGEMENT LEDGER</p>
        </div>
        <div className="receipt-order-section">
          <p className="receipt-order-number">{orderNumber}</p>
          <p className="receipt-order-info">
            {date} <span className="receipt-status-separator">·</span> {status}
          </p>
        </div>
      </div>

      {/* Main Body with Columns */}
      <div className="receipt-body">
        {/* Left Column: Shipping & Payment */}
        <div className="receipt-column receipt-col-left">
          <div className="receipt-info-block">
            <h3 className="receipt-block-heading">
              <span className="icon-shipping">
                <MdLocalShipping />
              </span>{" "}
              SHIPPING TO
            </h3>
            <p className="receipt-shipping-name">{shipping.name}</p>
            <p className="receipt-shipping-phone">{shipping.phone}</p>
            {shipping.address.map((line, index) => (
              <p key={index} className="receipt-shipping-address-line">
                {line}
              </p>
            ))}
          </div>
          <div className="receipt-info-block">
            <h3 className="receipt-block-heading">
              <span className="icon-payment">
                <RiMoneyRupeeCircleFill />
              </span>{" "}
              PAYMENT INFO
            </h3>
            <div className="receipt-payment-method">
              <p className="receipt-payment-text">{payment.method.text}</p>
            </div>
            <p className="receipt-payment-label">METHOD</p>
            <p className="receipt-transaction-id">{payment.transactionId}</p>
            <p className="receipt-payment-label">TRANSACTION ID</p>
          </div>
        </div>

        {/* Middle Column: Order Details */}
        <div className="receipt-column receipt-col-middle">
          <h3 className="receipt-block-heading">
            <span className="icon-order">
              <TbReceiptFilled />
            </span>{" "}
            ORDER DETAILS
          </h3>
          <div className="receipt-items-list">
            {items.map((item) => (
              <div key={item.id} className="receipt-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="receipt-item-image"
                />
                <div className="receipt-item-details">
                  <p className="receipt-item-name">{item.name}</p>
                  <p className="receipt-item-info">{item.details}</p>
                </div>
                <p className="receipt-item-price">{item.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Pricing, Barcode & Button */}
        <div className="receipt-column receipt-col-right">
          <div className="receipt-pricing-block">
            <div className="receipt-price-row">
              <span className="price-label">Subtotal</span>
              <span className="price-value">{pricing.subtotal}</span>
            </div>
            <div className="receipt-price-row discount-row">
              <span className="price-label">
                Discount{" "}
                <span className="discount-tag">{pricing.discount.code}</span>
              </span>
              <span className="price-value discount-value">
                {pricing.discount.value}
              </span>
            </div>
            <div className="receipt-price-row">
              <span className="price-label">Shipping Fee</span>
              <span className="price-value">{pricing.shippingFee}</span>
            </div>
            <div className="receipt-grand-total-row">
              <span className="grand-total-label">GRAND TOTAL</span>
              <div className="grand-total-value-wrapper">
                <span className="grand-total-value">{pricing.grandTotal}</span>
                <span className="icon-check-circle">
                  <FaCheck />
                </span>
              </div>
            </div>
          </div>
          <div className="receipt-barcode-section">
            {/* Basic Barcode mock - in a real app use a library */}
            <div className="receipt-barcode-image">|| || || || || ||</div>
            <p className="receipt-barcode-text">98231000772910</p>
          </div>
          <div className="receipt-download-section">
            <DashboardButton
              onClick={onDownloadCopy}
              icon={<FaFileDownload />}
              name="DOWNLOAD COPY"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="receipt-footer">
        <p>
          THANK YOU FOR SHOPPING WITH US! FOR SUPPORT, CONTACT{" "}
          <a
            href="mailto:HELP@DRYFRUITLEDGER.COM"
            className="receipt-support-email"
          >
            HELP@DRYFRUITLEDGER.COM
          </a>
        </p>
      </div>
    </div>
  );
};

export default OrderReceipt;
