import React, { useEffect, useState } from "react";
import "./Auth.css";
import {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiArrowRight,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import BANNNER from "../../../data/Banner nuts.png";
import BANNNER2 from "../../../data/Banner dates.png";
import LOGO from "../../../data/logo.png";
import AuthHeader from "../../assets/categories_header";
import DashboardButton from "../../assets/ui/DashBoardButton/DashBoardButton";
import { useLocation, useNavigate } from "react-router-dom";
import { emailRegex, mobileRegex, siteName } from "../../utils/utils";
import DashboardInput from "../../assets/ui/DashBoardInput/DashBoardInput";
import { User } from "../../entity/user";
import { UserAccountService } from "../../service/user_account";
import Loader2 from "../../assets/loader/Loader2";
import Toast from "../../assets/toast/Toast";
import axios, { AxiosError } from "axios";

const AuthCard: React.FC = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>(null);
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>(null);
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>(null);
  const [re_password, setRe_Password] = useState<string>("");
  const [re_PasswordError, setRe_PasswordError] = useState<string>(null);
  const [mobile, setMobile] = useState<string>("");
  const [mobileError, setMobileError] = useState<string>(null);
  const [remember, setRemember] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRe_Password, setShowRe_Password] = useState<boolean>(false);
  const [toastError, setToastError] = useState<string>(null);
  const toggleAuth = () => setIsLogin(!isLogin);

  const panelStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${isLogin ? BANNNER2 : BANNNER})`,
  };

  useEffect(() => {
    if (location?.state?.isSignUp == false) {
      setIsLogin(false);
    }
  }, [location]);

  const isValid = () => {
    if (!isLogin && !name) {
      setNameError("Please Enter The Name");
    } else if (!email) {
      setEmailError("Please Enter The Email Address");
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid Email Address");
    } else if (!isLogin && !mobile) {
      setMobileError("Please Enter Mobile NUmber");
    } else if (!isLogin && mobile?.length < 10) {
      setMobileError("Invalid Mobile Number");
    } else if (!isLogin && !mobileRegex.test(mobile)) {
      setMobileError("Invalid Mobile Number");
    } else if (!password) {
      setPasswordError("Please Enter Password");
    } else if (!isLogin && !re_password) {
      setRe_PasswordError("Please Enter Re-Password");
    } else if (!isLogin && password != re_password) {
      setPasswordError("Password Mismatch");
      setRe_PasswordError("Please Mismatch");
    } else {
      return true;
    }
    return false;
  };

  const onSubmit = async () => {
    if (isValid()) {
      setIsLoading(true);
      try {
        if (isLogin) {
          // TODO: nned to check this login in flow
          await new UserAccountService().loginIn(email, password);
        } else {
          await new UserAccountService().signUp(name, mobile, email, password);
        }
        navigate(-1);
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.data?.statusCode) {
          setToastError(error.response?.data?.error);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const OnChangeName = (name: string) => {
    if (name?.length > 25) {
      setNameError("Only 25 characters allowed");
    } else {
      setName(name);
      setNameError(null);
    }
  };

  const OnChangeEmail = (email: string) => {
    if (email?.length > 60) {
      setEmailError("Only 60 characters allowed");
    } else {
      setEmail(email);
      setEmailError(null);
    }
  };

  const OnChangeMobile = (mobile: string) => {
    if (mobile?.length <= 10) {
      if (mobile) {
        if (mobileRegex.test(mobile)) {
          setMobile(mobile);
          setMobileError(null);
        }
      } else {
        setMobile(mobile);
      }
    }
  };

  const OnChangePassword = (val: string) => {
    if (
      passwordError === "Password Mismatch" ||
      re_PasswordError === "Password Mismatch"
    ) {
      setPasswordError(null);
      setRe_PasswordError(null);
    }

    if (val?.length > 16) {
      setPasswordError("Only 16 numbers allowed");
    } else {
      setPassword(val);
      if (passwordError !== "Password Mismatch") {
        setPasswordError(null);
      }
    }
  };

  const OnChangeRe_Password = (val: string) => {
    if (
      passwordError === "Password Mismatch" ||
      re_PasswordError === "Password Mismatch"
    ) {
      setPasswordError(null);
      setRe_PasswordError(null);
    }

    if (val?.length > 16) {
      setRe_PasswordError("Only 16 numbers allowed");
    } else {
      setRe_Password(val);
      if (re_PasswordError !== "Password Mismatch") {
        setRe_PasswordError(null);
      }
    }
  };

  return (
    <>
      {isLoading && <Loader2 />}
      {toastError && (
        <Toast
          title={isLogin ? "Login" : "Sign Up"}
          description={toastError}
          isError={true}
          duration={5000}
          onClose={() => setToastError(null)}
        />
      )}
      <AuthHeader marginTop="0px" />
      <div className="login-signup-auth-container">
        <div className="login-signup-auth-card">
          <div className="login-signup-auth-image-panel" style={panelStyle}>
            <div className="login-signup-overlay-content">
              <h1 className="login-signup-brand-logo-text">
                <img src={LOGO} width={70} height={70}></img>
                {siteName}
              </h1>
              <h1
                className="login-signup-title"
                style={{
                  marginTop: isLogin ? "-145px" : "-240px",
                  marginLeft: isLogin ? "75px" : "",
                }}
              >
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

              {/* <form
                onSubmit={(e) => {
                  if (isValid()) {
                    e.preventDefault();
                  }
                }}
              > */}
              {!isLogin && (
                <div className="login-signup-input-group">
                  <label>FULL NAME</label>
                  <div className="login-signup-input-wrapper">
                    <DashboardInput
                      icon={<FiUser />}
                      onChange={(val) => {
                        OnChangeName(val);
                      }}
                      value={name}
                      placeholder="Johnathan Appleseed"
                      error={nameError ? true : false}
                      errorMessage={nameError}
                    />
                  </div>
                </div>
              )}

              <div className="login-signup-input-group">
                <label>EMAIL ADDRESS</label>
                <div className="login-signup-input-wrapper">
                  <DashboardInput
                    icon={<FiMail />}
                    onChange={(val) => {
                      OnChangeEmail(val);
                    }}
                    value={email}
                    placeholder="curator@gmail.com"
                    error={emailError ? true : false}
                    errorMessage={emailError}
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="login-signup-input-group">
                  <label>MOBILE NUMBER</label>
                  <div className="login-signup-input-wrapper">
                    <DashboardInput
                      icon={<FiPhone />}
                      onChange={(val) => {
                        OnChangeMobile(val);
                      }}
                      value={mobile}
                      placeholder="9876543210"
                      error={mobileError ? true : false}
                      errorMessage={mobileError}
                    />
                  </div>
                </div>
              )}

              <div className="login-signup-password-row">
                <div className="login-signup-input-group">
                  <label>PASSWORD</label>
                  <div className="login-signup-input-wrapper">
                    <DashboardInput
                      // label="Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(val) => {
                        OnChangePassword(val);
                      }}
                      icon={
                        showPassword ? (
                          <FiEye size={20} />
                        ) : (
                          <FiEyeOff size={20} />
                        )
                      }
                      onClickIcon={() => setShowPassword(!showPassword)}
                      error={passwordError ? true : false}
                      errorMessage={passwordError}
                    />
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
                      <DashboardInput
                        // label="Password"
                        type={showRe_Password ? "text" : "password"}
                        placeholder="••••••••"
                        value={re_password}
                        onChange={(val) => {
                          OnChangeRe_Password(val);
                        }}
                        icon={
                          showRe_Password ? (
                            <FiEye size={20} />
                          ) : (
                            <FiEyeOff size={20} />
                          )
                        }
                        onClickIcon={() => setShowRe_Password(!showRe_Password)}
                        error={re_PasswordError ? true : false}
                        errorMessage={re_PasswordError}
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* </form> */}

              <div className="login-signup-auth-footer">
                <DashboardButton
                  name={isLogin ? "Create Account" : "Sign In"}
                  variant="primary"
                  icon={<FiArrowRight />}
                  onClick={
                    isLogin
                      ? () => {
                          onSubmit();
                        }
                      : () => {
                          onSubmit();
                        }
                  }
                />
                <p>
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <span
                    className="login-signup-toggle-link"
                    onClick={toggleAuth}
                  >
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
