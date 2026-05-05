import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./Toast.css";

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
  // Auto-dismiss logic
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      // Cleanup the timer if the component unmounts before duration ends
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={`organic-toast-box ${isError ? "error-state" : "success-state"}`}
    >
      {/* Icon Column */}
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

      {/* Content Column */}
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

      {/* Close Button */}
      <button
        className="organic-toast-close-btn"
        onClick={onClose}
        aria-label="Close Toast"
      >
        <FiX />
      </button>
    </div>
  );
};

export default Toast;
