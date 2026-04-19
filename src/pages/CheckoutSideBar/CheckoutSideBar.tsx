import React, { ReactNode, useState } from "react";
import "./CheckoutSideBar.css";
import { FiUser, FiTruck, FiCreditCard, FiClipboard } from "react-icons/fi";

interface CheckoutOption {
  id: string;
  label: string;
  icon: ReactNode;
}

const CHECKOUT_OPTIONS: CheckoutOption[] = [
  { id: "identity", label: "Identity", icon: <FiUser /> },
  { id: "shipping", label: "Shipping", icon: <FiTruck /> },
  { id: "payment", label: "Payment", icon: <FiCreditCard /> },
  { id: "review", label: "Review", icon: <FiClipboard /> },
];

interface CheckoutSidebarProps {
  activeStep?: string;
  onStepChange?: (id: string) => void;
}

const CheckoutSidebar: React.FC<CheckoutSidebarProps> = ({
  activeStep = "identity",
  onStepChange,
}) => {
  const [currentStep, setCurrentStep] = useState(activeStep);

  const handleStepClick = (id: string) => {
    setCurrentStep(id);
    if (onStepChange) onStepChange(id);
  };

  return (
    <aside className="checkout-sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Checkout</h1>
        <p className="sidebar-subtitle">Complete your curation</p>
      </div>

      <nav className="sidebar-nav">
        {CHECKOUT_OPTIONS.map((option) => {
          const isActive = currentStep === option.id;
          return (
            <div
              key={option.id}
              className={`nav-option ${isActive ? "active" : ""}`}
              onClick={() => handleStepClick(option.id)}
            >
              <span className="option-icon">{option.icon}</span>
              <span className="option-label">{option.label}</span>
              {/* Optional: Add a small indicator for completion status later */}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default CheckoutSidebar;
