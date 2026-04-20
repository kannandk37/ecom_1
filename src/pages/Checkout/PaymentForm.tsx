import React, { useState } from "react";
import {
  FiChevronDown,
  FiCreditCard,
  FiDollarSign,
  FiUser,
} from "react-icons/fi";
import DashboardInput from "../../assets/ui/DashBoardInput/DashBoardInput";
import DashboardButton from "../../assets/ui/DashBoardButton/DashBoardButton";
import "./PaymentForm.css";
import { Upi } from "@boxicons/react";
interface PaymentFormProps {
  onPaymentSubmit?: (paymentData: any) => void;
  isLoading?: boolean;
}

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: <Upi size={"md"} /> },
  {
    id: "cod",
    label: "Cash on Delivery (COD)",
    icon: <FiDollarSign size={20} />,
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    icon: <FiCreditCard size={20} />,
  },
];

const PaymentForm: React.FC<PaymentFormProps> = ({
  onPaymentSubmit,
  isLoading,
}) => {
  // State to manage which accordion section is expanded. Defaults to "upi".
  const [expandedSection, setExpandedSection] = useState<string | null>("upi");
  // State to hold card details.
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  const [upiId, setUpiId] = useState<string>("");
  // Function to toggle the expanded accordion section.
  const toggleSection = (sectionId: string) => {
    setExpandedSection((prev) => (prev === sectionId ? null : sectionId));
  };

  // Function to handle form submission for the "card" method.
  const handleCardPayment = () => {
    // Collect data from the local state and any other source.
    const paymentInfo = {
      method: expandedSection,
      details: expandedSection === "card" ? cardData : null,
    };
    // If a prop-provided submission handler exists, call it.
    if (onPaymentSubmit) {
      onPaymentSubmit(paymentInfo);
    }
  };

  return (
    <div className="payment-form-container">
      <div className="section-header">
        <span className="step-tag">Step 03 of 4</span>
        <h2 className="section-title">Payment Method</h2>
      </div>

      <div className="payment-form-body">
        {PAYMENT_METHODS.map((method) => {
          const isExpanded = expandedSection === method.id;
          return (
            <div
              key={method.id}
              className={`accordion-item ${isExpanded ? "active" : ""}`}
            >
              <div
                className="accordion-header"
                onClick={() => toggleSection(method.id)}
              >
                <div className="header-left">
                  <span className="method-icon">{method.icon}</span>
                  <span className="method-label">{method.label}</span>
                </div>
                <FiChevronDown
                  className={`chevron-icon ${isExpanded ? "open" : ""}`}
                />
              </div>

              {/* Accordion Content - visible only when section is expanded */}
              <div className={`accordion-content ${isExpanded ? "open" : ""}`}>
                {method.id === "upi" && (
                  <div className="upi-content">
                    <DashboardInput
                      placeholder="upi@icici or upi@sbi .."
                      value={""}
                      onChange={(e: any) => setUpiId(e.target.value)}
                    />
                    <div className="upi-instruction">
                      <p>Enter UPI ID to proceed with your transaction.</p>
                      <DashboardButton
                        name={"Verify & Pay Now"}
                        variant="primary"
                        onClick={handleCardPayment} // Reusing handler for simplicity
                        width="100%"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                {method.id === "cod" && (
                  <div className="cod-content">
                    <p className="helper-text">
                      Pay with cash when your order is delivered to your
                      doorstep. Please keep the exact change ready for a
                      smoother experience.
                    </p>
                    <DashboardButton
                      name={"Confirm & Place Order"}
                      variant="primary"
                      onClick={handleCardPayment} // Reusing handler for simplicity
                      width="100%"
                      disabled={isLoading}
                    />
                  </div>
                )}

                {method.id === "card" && (
                  <div className="card-form">
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label>CARD NUMBER</label>
                      <DashboardInput
                        placeholder="0000 0000 0000 0000"
                        icon={<FiCreditCard />}
                        value={cardData.cardNumber}
                        onChange={(e: any) =>
                          setCardData({
                            ...cardData,
                            cardNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="row" style={{ marginBottom: 0 }}>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label>EXPIRY DATE</label>
                        <DashboardInput
                          placeholder="MM / YY"
                          value={cardData.expiryDate}
                          onChange={(e: any) =>
                            setCardData({
                              ...cardData,
                              expiryDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label>CVV</label>
                        <DashboardInput
                          placeholder="***"
                          value={cardData.cvv}
                          onChange={(e: any) =>
                            setCardData({ ...cardData, cvv: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label>NAME ON CARD</label>
                      <DashboardInput
                        placeholder="Enter name as on card"
                        icon={<FiUser />}
                        value={cardData.nameOnCard}
                        onChange={(e: any) =>
                          setCardData({
                            ...cardData,
                            nameOnCard: e.target.value,
                          })
                        }
                      />
                    </div>
                    <DashboardButton
                      name={"Pay Securely Now"}
                      variant="primary"
                      onClick={handleCardPayment}
                      width="100%"
                      disabled={isLoading}
                    />
                    <p className="privacy-note">
                      Your card details are encrypted and secure.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentForm;
