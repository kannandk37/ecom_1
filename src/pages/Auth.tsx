import React, { useState } from "react";
import "./Auth.css";
import {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiArrowRight,
  FiEyeOff,
} from "react-icons/fi";
import BANNNER from "../../data/Banner nuts.png";
import BANNNER2 from "../../data/Banner dates.png";
import LOGO from "../../data/logo.png";
import AuthHeader from "../assets/categories_header";
import DashboardButton from "../assets/ui/DashBoardButton/DashBoardButton";
import { useNavigate } from "react-router-dom";
import { siteName } from "../utils/utils";

const AuthCard: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const toggleAuth = () => setIsLogin(!isLogin);

  const panelStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${isLogin ? BANNNER2 : BANNNER})`,
  };

  let categories = ["asd", "asd", "asd"];

  return (
    <>
      <AuthHeader />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-image-panel" style={panelStyle}>
            <div className="overlay-content">
              <h1 className="brand-logo-text">{siteName}</h1>
              <div className="image-footer-card">
                <span className="sparkle-icon">✨</span>
                <p>
                  Nature's finest treasures, curated for your sophisticated
                  palate.
                </p>
              </div>
            </div>
          </div>

          <div className="auth-form-panel">
            <div className="form-header">
              <div className="leaf-logo">
                <img src={LOGO} width={50} height={50}></img>
              </div>
              <h2 className="brand-title">{siteName}</h2>
            </div>

            <div className="form-content">
              <h1 className="title">
                {isLogin ? "Welcome Back" : "Join The Organic Journey"}
              </h1>
              <p className="subtitle">
                {isLogin
                  ? "Sign in to continue your organic journey."
                  : "Create an account to start your organic journey."}
              </p>

              <form onSubmit={(e) => e.preventDefault()}>
                {!isLogin && (
                  <div className="input-group">
                    <label>FULL NAME</label>
                    <div className="input-wrapper">
                      <FiUser className="input-icon" />
                      <input type="text" placeholder="Johnathan Appleseed" />
                    </div>
                  </div>
                )}

                <div className="input-group">
                  <label>EMAIL ADDRESS</label>
                  <div className="input-wrapper">
                    <FiMail className="input-icon" />
                    <input type="email" placeholder="curator@gmail.com" />
                  </div>
                </div>

                {!isLogin && (
                  <div className="input-group">
                    <label>MOBILE NUMBER</label>
                    <div className="input-wrapper">
                      <FiPhone className="input-icon" />
                      <input type="text" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                )}

                <div className="password-row">
                  <div className="input-group">
                    <label>PASSWORD</label>
                    <div className="input-wrapper">
                      <FiLock className="input-icon" />
                      <input type="password" placeholder="••••••••" />
                      {isLogin && (
                        <span
                          className="forgot-link"
                          onClick={() => {
                            //TODO: need to navigate to screen saying email sent to email
                          }}
                        >
                          Forgot Password?
                        </span>
                      )}
                    </div>
                  </div>

                  {!isLogin && (
                    <div className="input-group">
                      <label>RE-TYPE PASSWORD</label>
                      <div className="input-wrapper">
                        <FiLock className="input-icon" />
                        <input type="password" placeholder="••••••••" />
                      </div>
                    </div>
                  )}
                </div>

                <DashboardButton
                  name={isLogin ? "Create Account" : "Sign In"}
                  variant="primary"
                  icon={<FiArrowRight />}
                  onClick={isLogin ? () => {} : () => {}}
                />
              </form>

              <div className="auth-footer">
                <p>
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <span className="toggle-link" onClick={toggleAuth}>
                    {isLogin ? "Sign Up" : "Log In"}
                  </span>
                </p>
                {isLogin && (
                  <div className="sustainability-tag">
                    🍃 SUSTAINABLY SOURCED 🍃
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthCard;
