import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./Toast.css";

// <Toast
//   title="Category"
//   description="Unable to Get Category"
//   isError={true}
//   duration={5000} // Disappears after 4 seconds
//   onClose={() => console.log("cannpt get categories")}
// />;
// failure
// <Toast
//   title="Payment Failed"
//   description="We couldn't process your transaction. Please check your card details."
//   isError={true}
//   actionText="Update Billing Info"
//   onAction={() => navigate("/billing")} // Navigates or triggers a modal
//   duration={6000} // Keeps the error on screen a bit longer
//   onClose={() => setShowToast(false)}
// />;

export interface ToastProps {
  title: string;
  description?: string;
  isError?: boolean;
  duration?: number; // Duration in milliseconds (e.g., 3000)
  actionText?: string;
  onAction?: () => void;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  title,
  description,
  isError = false,
  duration = 5000, // Default to 5 seconds
  actionText,
  onAction,
  onClose,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true); // Adds the 'closing' CSS class
    setTimeout(() => {
      onClose();
    }, 400);
  };

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  return (
    <div
      className={`organic-toast-box ${isError ? "error-state" : "success-state"} ${isClosing ? "closing" : ""}`}
    >
      <div className="organic-toast-icon-wrapper">
        {isError ? (
          <div className="toast-icon-bg error-bg">
            <FaTimesCircle className="toast-icon error-icon" />
          </div>
        ) : (
          <div className="toast-icon-bg success-bg">
            <FaCheckCircle className="toast-icon success-icon" />
          </div>
        )}
      </div>

      <div className="organic-toast-content">
        <h4 className="organic-toast-title">{title}</h4>

        {description && (
          <p className="organic-toast-description">{description}</p>
        )}

        {isError && actionText && (
          <button className="organic-toast-action-btn" onClick={onAction}>
            {actionText}
          </button>
        )}
      </div>

      <button
        className="organic-toast-close-btn"
        onClick={handleClose}
        aria-label="Close Toast"
      >
        <FiX />
      </button>
    </div>
  );
};

export default Toast;