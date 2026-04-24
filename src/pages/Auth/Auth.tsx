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
import BANNNER from "../../../data/Banner nuts.png";
import BANNNER2 from "../../../data/Banner dates.png";
import LOGO from "../../../data/logo.png";
import AuthHeader from "../../assets/categories_header";
import DashboardButton from "../../assets/ui/DashBoardButton/DashBoardButton";
import { useNavigate } from "react-router-dom";
import { siteName } from "../../utils/utils";

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
      <AuthHeader marginTop="0px" />
      <div className="login-signup-auth-container">
        <div className="login-signup-auth-card">
          <div className="login-signup-auth-image-panel" style={panelStyle}>
            <div className="login-signup-overlay-content">
              <h1 className="login-signup-brand-logo-text">
                <img src={LOGO} width={70} height={70}></img>
                {siteName}
              </h1>
              <h1 className="login-signup-title" style={{marginTop: isLogin ? '-145px' : '-240px', marginLeft: isLogin ? '75px' : ''}}>
                {isLogin ? "Welcome Back" : "Join The Organic Journey"}
              </h1>
              <div className="login-signup-image-footer-card">
                <span className="login-signup-sparkle-icon">✨</span>
                <p>
                  Nature's finest treasures, curated for your sophisticated
                  palate.
                </p>
              </div>
            </div>
          </div>

          <div className="login-signup-auth-form-panel">

            <div className="login-signup-form-content">
              <p className="login-signup-subtitle">
                {isLogin
                  ? "Sign in to continue your organic journey."
                  : "Create an account to start your organic journey."}
              </p>

              <form onSubmit={(e) => e.preventDefault()}>
                {!isLogin && (
                  <div className="login-signup-input-group">
                    <label>FULL NAME</label>
                    <div className="login-signup-input-wrapper">
                      <FiUser className="login-signup-input-icon" />
                      <input type="text" placeholder="Johnathan Appleseed" />
                    </div>
                  </div>
                )}

                <div className="login-signup-input-group">
                  <label>EMAIL ADDRESS</label>
                  <div className="login-signup-input-wrapper">
                    <FiMail className="login-signup-input-icon" />
                    <input type="email" placeholder="curator@gmail.com" />
                  </div>
                </div>

                {!isLogin && (
                  <div className="login-signup-input-group">
                    <label>MOBILE NUMBER</label>
                    <div className="login-signup-input-wrapper">
                      <FiPhone className="login-signup-input-icon" />
                      <input type="text" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                )}

                <div className="login-signup-password-row">
                  <div className="login-signup-input-group">
                    <label>PASSWORD</label>
                    <div className="login-signup-input-wrapper">
                      <FiLock className="login-signup-input-icon" />
                      <input type="password" placeholder="••••••••" />
                      {isLogin && (
                        <span
                          className="login-signup-forgot-link"
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
                    <div className="login-signup-input-group">
                      <label>RE-TYPE PASSWORD</label>
                      <div className="login-signup-input-wrapper">
                        <FiLock className="login-signup-input-icon" />
                        <input type="password" placeholder="••••••••" />
                      </div>
                    </div>
                  )}
                </div>

              </form>

              <div className="login-signup-auth-footer">
                <DashboardButton
                  name={isLogin ? "Create Account" : "Sign In"}
                  variant="primary"
                  icon={<FiArrowRight />}
                  onClick={isLogin ? () => { } : () => { }}
                />
                <p>
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <span className="login-signup-toggle-link" onClick={toggleAuth}>
                    {isLogin ? "Sign Up" : "Log In"}
                  </span>
                </p>
                  <div className="login-signup-sustainability-tag">
                    🍃 Farm-to-Table Quality 🍃
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthCard;
