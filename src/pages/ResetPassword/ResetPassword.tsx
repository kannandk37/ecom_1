import React, { useState } from "react";
import "./ResetPassword.css";
import { FiLock, FiKey, FiArrowLeft } from "react-icons/fi";
import LOGO from "../../../data/logo.png";
import DashboardButton from "../../assets/ui/DashBoardButton/DashBoardButton";
import { useNavigate } from "react-router-dom";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-form-panel">
          <div className="form-header" onClick={() => navigate("/")}>
            <img src={LOGO} width={50} height={50}></img>
            <h2 className="brand-title">Nature's Candy</h2>
          </div>

          <div className="form-content">
            <h1>Reset Your Password</h1>
            <p className="subtitle">
              Enter and Confirm your new password to continue.
            </p>

            {/* //TODO: need to add the visible icon to revel the password */}
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="input-group">
                <label>NEW PASSWORD</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input type="password" placeholder="••••••••" />
                </div>
              </div>

              <div className="input-group">
                <label>RE-TYPE PASSWORD</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
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

            <div className="auth-footer">
              <span
                className="toggle-link"
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
      <div className="support-div">
        <p className="support">For Support</p>
        <p className="support">naturecandy@gmail.com</p>
      </div>
    </div>
  );
};

export default ResetPassword;
