import React, { useEffect, useState } from "react";
import "./ResetPassword.css";
import { FiKey, FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import LOGO from "../../../data/logo.png";
import DashboardButton from "../../assets/ui/DashBoardButton/DashBoardButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardInput from "../../assets/ui/DashBoardInput/DashBoardInput";
import { UserAccountService } from "../../service/user_account";
import Loader2 from "../../assets/loader/Loader2";
import Toast from "../../assets/toast/Toast";
import axios from "axios";
import { ProfileService } from "../../service/profile";
import { RoleName } from "../../entity/role";
import { LocalStorage } from "../../storage";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isPasswordError, setIsPasswordError] = useState<string>('');
  const [showRePassword, setShowRePassword] = useState<boolean>(false);
  const [rePassword, setRePassword] = useState<string>("");
  const [isRePasswordError, setIsRePasswordError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnterprise, setIsEnterprise] = useState<boolean>(false);
  const [toast, setToast] = useState<string>(null);
  const [isEmailNotFound, setIsEmailNotFound] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (searchParams.get('email')) {
        try {
          let response = await new ProfileService().getByEmail(searchParams.get('email'));
          if (response) {
            setIsEnterprise(response?.role?.name == (RoleName.ADMIN || RoleName.SUPERADMIN) ? true : false);
          } else {
            setIsEmailNotFound(true);
            setToast('Email Not Found');
          }
        } catch (error: any) {
          console.log(error);
          setIsLoading(false);
          if (axios.isAxiosError(error) && error.response?.data?.statusCode) {
            setToast(error.response?.data?.error);
          }
        }
      }
    })()
  }, [searchParams.get('email')])

  const isValid = () => {
    if (!password) {
      setIsPasswordError('Please Enter Password');
    } else if (!rePassword) {
      setIsRePasswordError('Please Enter Re-Type Password');
    } else if (password !== rePassword) {
      setIsPasswordError("Password Mismatch");
      setIsRePasswordError("Please Mismatch");
    } else {
      return true;
    }
    return false;
  };

  const handleResetPassword = async () => {
    if (isValid()) {
      setIsLoading(true);
      try {
        let response = await new UserAccountService().resetPassword(searchParams.get('email'), password);
        if (response) {
          let token = response.data.token;
          let refreshToken = response.data.refreshToken;
          let storagePersistor = new LocalStorage();
          await storagePersistor.storeToken(token, remember);
          await storagePersistor.storeRefreshToken(refreshToken, remember);
          navigate('/dashboard/categories');
        }
        setIsLoading(false);
      } catch (error: any) {
        console.log(error);
        setIsLoading(false);
        if (axios.isAxiosError(error) && error.response?.data?.statusCode) {
          setToast(error.response?.data?.error);
        }
      }
    }
  };

  const OnChangePassword = (val: string) => {
    if (
      isPasswordError === "Password Mismatch" ||
      isRePasswordError === "Password Mismatch"
    ) {
      setIsPasswordError(null);
      setIsRePasswordError(null);
    }

    if (val?.length > 16) {
      setIsPasswordError("Only 16 numbers allowed");
    } else {
      setPassword(val);
      if (isPasswordError !== "Password Mismatch") {
        setIsPasswordError(null);
      }
    }
  };

  const OnChangeRePassword = (val: string) => {
    if (
      isPasswordError === "Password Mismatch" ||
      isRePasswordError === "Password Mismatch"
    ) {
      setIsPasswordError(null);
      setIsRePasswordError(null);
    }

    if (val?.length > 16) {
      setIsRePasswordError("Only 16 numbers allowed");
    } else {
      setRePassword(val);
      if (isRePasswordError !== "Password Mismatch") {
        setIsRePasswordError(null);
      }
    }
  };

  return (
    <>
      {
        isLoading ? (
          <Loader2 />
        ) : (
          <>
            {toast && (
              <Toast
                title="Reset Password"
                description={toast}
                isError={true}
                duration={5000}
                onClose={() => setToast(null)}
              />
            )}
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

                    {
                      isEmailNotFound &&
                      <p className="reset-password-error-email-not-found">
                        Email Not Found
                      </p>
                    }

                    {/* <form onSubmit={(e) => e.preventDefault()}> */}

                      <div className="reset-password-input-group">
                        <DashboardInput
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(val) => OnChangePassword(val)}
                          icon={
                            showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />
                          }
                          onClickIcon={() => setShowPassword(!showPassword)}
                          error={isPasswordError ? true : false}
                          errorMessage="Please Enter Password"
                          required={true}
                          disabled={isEmailNotFound}
                        />
                      </div>

                      <div className="reset-password-input-group">
                        <DashboardInput
                          label="Re-Type Password"
                          type={showRePassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={rePassword}
                          onChange={(val) => OnChangeRePassword(val)}
                          icon={
                            showRePassword ? <FiEye size={20} /> : <FiEyeOff size={20} />
                          }
                          onClickIcon={() => setShowRePassword(!showRePassword)}
                          error={isRePasswordError ? true : false}
                          errorMessage="Please Enter Re-Enter Password"
                          required={true}
                          disabled={isEmailNotFound}
                        />
                      </div>

                      <label className="reset-password-el-checkbox-container">
                        <input
                          type="checkbox"
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                          hidden
                        />
                        <span className="reset-password-el-checkmark"></span>
                        Keep me logged in
                      </label>

                      <DashboardButton
                        name={"Reset Password"}
                        variant="primary"
                        icon={<FiKey />}
                        onClick={handleResetPassword}
                        disabled={isEmailNotFound}
                      />
                    {/* </form> */}

                    <div className="reset-password-auth-footer">
                      <span
                        className="reset-password-toggle-link"
                        style={{ cursor: isEmailNotFound && 'not-allowed' }}
                        onClick={() => {
                          if (!isEmailNotFound) {
                            if (isEnterprise) {
                              navigate("/enterprise.com");
                            } else {
                              navigate('/');
                            }
                          }
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
          </>
        )
      }
    </>
  );
};

export default ResetPassword;
