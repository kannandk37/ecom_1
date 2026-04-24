import React, { useState } from "react";
import "./ResetPassword.css";
import { FiLock, FiKey, FiArrowLeft } from "react-icons/fi";
import LOGO from "../../../data/logo.png";
import DashboardButton from "../../assets/ui/DashBoardButton/DashBoardButton";
import { useNavigate } from "react-router-dom";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="reset-password-auth-container">
      <div className="reset-password-auth-card">
        <div className="reset-password-auth-form-panel">
          <div className="reset-password-form-header" onClick={() => navigate("/")}>
            <img src={LOGO} width={50} height={50}></img>
            <h2 className="reset-password-brand-title">Nature's Candy</h2>
          </div>

          <div className="reset-password-form-content">
            <h1>Reset Your Password</h1>
            <p className="reset-password-subtitle">
              Enter and Confirm your new password to continue.
            </p>

            {/* //TODO: need to add the visible icon to revel the password */}
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="reset-password-input-group">
                <label>NEW PASSWORD</label>
                <div className="reset-password-input-wrapper">
                  <FiLock className="reset-password-input-icon" />
                  <input type="password" placeholder="••••••••" />
                </div>
              </div>

              <div className="reset-password-input-group">
                <label>RE-TYPE PASSWORD</label>
                <div className="reset-password-input-wrapper">
                  <FiLock className="reset-password-input-icon" />
                  <input type="password" placeholder="••••••••" />
                </div>
              </div>

              <DashboardButton
                name={"Reset Password"}
                variant="primary"
                icon={<FiKey />}
                onClick={() => {}}
              />
            </form>

            <div className="reset-password-auth-footer">
              <span
                className="reset-password-toggle-link"
                onClick={() => {
                  navigate("/login");
                }}
              >
                <FiArrowLeft />
                {"Back to Login"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="reset-password-support-div">
        <p className="reset-password-support">For Support</p>
        <p className="reset-password-support">naturecandy@gmail.com</p>
      </div>
    </div>
  );
};

export default ResetPassword;
