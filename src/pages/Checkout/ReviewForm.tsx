import React, { ReactNode } from "react";
import { FiMapPin, FiCreditCard, FiPackage } from "react-icons/fi";
// import { DashboardInput, DashboardButton } from './your-component-library'; // Adjust path
import "./ReviewForm.css";

// Re-using the same Product interface for consistency
export interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  weight: number;
  unit: string;
  isFav: boolean;
  categoryId: number;
  images: string[];
  quantity?: number; // Added for cart/review
}

interface ReviewFormProps {
  shippingAddress: any;
  // {
  //   type: string;
  //   name: string;
  //   addressLine: string;
  //   phone: string;
  // };
  paymentMethod: any;
  // {
  //   name: string;
  //   icon: ReactNode;
  //   description: string;
  // };
  items: any[];
  onPlaceOrder: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  shippingAddress,
  paymentMethod,
  items,
  onPlaceOrder,
}) => {
  // Common component for a review card to improve reusability and clean up code
  const ReviewCard = ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon: ReactNode;
    children: React.ReactNode;
  }) => (
    <div className="review-card">
      <div className="card-header">
        <div className="header-left">
          <span className="section-icon">{icon}</span>
          <h3 className="section-title">{title}</h3>
        </div>
        <button className="change-link-btn">Change</button>
      </div>
      <div className="card-content">{children}</div>
    </div>
  );

  return (
    <div className="review-form-container">
      {/* Header Section */}
      <div className="section-header">
        <span className="step-tag">Step 04 of 4</span>
        <h2 className="section-title">Review Your Selection</h2>
        <p className="section-subtitle">
          Final verification before we begin preparation.
        </p>
      </div>

      <div className="review-sections">
        {/* Shipping Address Card */}
        <ReviewCard title="Shipping Address" icon={<FiMapPin />}>
          <div className="address-details">
            <p className="address-type-name">
              {shippingAddress.type} - {shippingAddress.name}
            </p>
            <p className="address-line">{shippingAddress.addressLine}</p>
            <p className="address-phone">{shippingAddress.phone}</p>
          </div>
        </ReviewCard>

        {/* Payment Method Card */}
        <ReviewCard title="Payment Method" icon={<FiCreditCard />}>
          <div className="payment-details">
            <div className="payment-icon-name">
              <span className="payment-method-icon">{paymentMethod.icon}</span>
              <p className="payment-method-name">{paymentMethod.name}</p>
            </div>
            <p className="payment-description">{paymentMethod.description}</p>
          </div>
        </ReviewCard>

        {/* Items Review Card - The one with a scrollbar */}
        <div className="items-review-card">
          <div className="card-header">
            <div className="header-left">
              <span className="section-icon">
                <FiPackage />
              </span>
              <h3 className="section-title">Items Review</h3>
            </div>
          </div>

          {/* This is the container with a max-height and overflow for the scrollbar */}
          <div className="items-list-scrollable">
            {items.map((item, index) => (
              <div key={item.id} className={`item-row`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="item-thumbnail"
                />
                <div className="item-info">
                  <p className="item-name">{item.title}</p>
                  <p className="item-weight">
                    Weight: {item.weight}
                    {item.unit}
                  </p>
                  <p className="item-qty">Quantity: {item.quantity || 1}</p>
                </div>
                <div className="item-price">
                  ₹{" "}
                  {(item.price * (item.quantity || 1)).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
