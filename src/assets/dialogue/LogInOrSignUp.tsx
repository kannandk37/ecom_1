import React from "react";
import { useNavigate } from "react-router-dom";
import { FiX, FiArrowRight } from "react-icons/fi";
import LOGO from "../../../data/logo.png";

// Adjust the import path to match your project structure
import DashBoardButton from "../ui/DashBoardButton/DashBoardButton";
import "./LogInOrSignUp.css";

interface LogInOrSignUpProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogInOrSignUp: React.FC<LogInOrSignUpProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSignIn = () => {
    onClose();
    navigate("/login");
  };

  const handleSignUp = () => {
    onClose();
    navigate("/login", { state: { isSignUp: false } });
  };

  return (
    <div
      className="login-signup-dialogue-box-overlay"
      onClick={handleOverlayClick}
    >
      <div className="login-signup-dialogue-box-modal">
        <button
          className="login-signup-dialogue-box-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX />
        </button>

        <div className="login-signup-dialogue-box-content">
          <img className="login-signup-dialogue-box-icon" src={LOGO}></img>

          <div className="login-signup-dialogue-box-section">
            <h2 className="login-signup-dialogue-box-title">
              Already a member?
            </h2>
            <p className="login-signup-dialogue-box-subtitle">
              Access your curated control center.
            </p>
            <div className="login-signup-dialogue-box-btn-wrapper">
              <DashBoardButton
                name="Sign In"
                variant="primary"
                icon={<FiArrowRight />}
                onClick={handleSignIn}
              />
            </div>
          </div>

          <div className="login-signup-dialogue-box-divider">
            <span>OR</span>
          </div>

          <div className="login-signup-dialogue-box-section">
            <h2 className="login-signup-dialogue-box-title">
              New to the Ledger?
            </h2>
            <p className="login-signup-dialogue-box-subtitle">
              Create an account to begin your journey.
            </p>
            <div className="login-signup-dialogue-box-btn-wrapper">
              <DashBoardButton
                name="Create an Account"
                variant="secondary"
                onClick={handleSignUp}
              />
            </div>
          </div>
        </div>

        <div className="login-signup-dialogue-box-footer">
          <p>
            By proceeding, you agree to our{" "}
            <span className="login-signup-dialogue-box-link">
              Terms of Service
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogInOrSignUp;
