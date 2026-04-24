import React, { useState } from "react";
import { FiUser, FiMail, FiShield, FiArrowRight } from "react-icons/fi";
import "./IdentityForm.css";
import DashboardButton from "../../assets/ui/DashBoardButton/DashBoardButton";
import DashboardInput from "../../assets/ui/DashBoardInput/DashBoardInput";

interface IdentityFormProps {
  onNextStep: (data: { fullName: string; email: string }) => void;
  isLoading?: boolean;
}

const IdentityForm: React.FC<IdentityFormProps> = ({
  onNextStep,
  isLoading,
}) => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleNext = () => {
    if (fullName && email) {
      onNextStep({ fullName, email });
    } else {
      alert("Please fill in all identity details.");
    }
  };

  return (
    <div className="identity-container">
      <div className="section-header">
        <span className="step-tag">Step 01</span>
        <h2 className="section-title">Identity</h2>
        <p className="section-subtitle">
          Please provide your basic information to start your order curation.
        </p>
      </div>

      <div className="identity-form-body">
        <DashboardInput
          label="Full Name"
          placeholder="admin@gmail.com"
          value={fullName}
          onChange={(val) => {
            setFullName(val);
          }}
          icon={<FiUser />}
          required
        />

        <DashboardInput
          label="Email Address"
          type="email"
          placeholder="admin@gmail.com"
          value={email}
          onChange={(val) => {
            console.log("vale", val);
            setEmail(val);
          }}
          icon={<FiMail />}
          required
        />
        <div className="identity-actions">
          <DashboardButton
            name="Next Step"
            variant="primary"
            icon={<FiArrowRight />}
            disabled={!fullName || !email || isLoading}
            onClick={handleNext}
            width="100%"
          />
        </div>
      </div>

      {/* Security/Trust Banner */}
      {/* <div className="security-banner">
        <div className="security-icon-box">
          <FiShield />
        </div>
        <div className="security-text">
          <strong>Secure Identity Verification</strong>
          <p>
            Your personal details are encrypted and handled with the highest
            privacy standards of The Organic Ledger curator network.
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default IdentityForm;
