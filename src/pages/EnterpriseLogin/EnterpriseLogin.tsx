import React, { useState } from "react";
import "./EnterpriseLogin.css";
import { FiMail, FiLock } from "react-icons/fi";
import DashboardButton from "../../assets/ui/DashBoardButton/DashBoardButton";
import DashboardInput from "../../assets/ui/DashBoardInput/DashBoardInput";
import { emailRegex } from "../../utils/utils";
import { LOGO } from "@/src/utils/utils";

// import { FiTrendingUp } from "react-icons/fi";
// import StatisticCard from "@/src/assets/ui/StatisticCard/StatisticCard";
// import PerformanceBar from "@/src/assets/ui/PerformanceBar/PerformanceBar";
// import LeaderboardBar from "@/src/assets/ui/LeaderboardBar/LeaderboardBar";
import { useNavigate } from "react-router-dom";

// const salesData = [
//   { name: "California Almonds", count: 20, percentage: 82 },
//   { name: "Medjool Dates", count: 20, percentage: 65 },
//   { name: "Organic Cashews", count: 20, percentage: 48 },
//   { name: "Pistachio Green", count: 20, percentage: 34 },
//   { name: "Pistachio Green", count: 20, percentage: 34 },
//   { name: "Pistachio Green", count: 20, percentage: 34 },
//   { name: "Pistachio Green", count: 20, percentage: 34 },
//   { name: "Pistachio Green", count: 20, percentage: 34 },
// ];

// const purchasingData = [
//   {
//     name: "Ananya Sharma",
//     pic: "https://randomuser.me/api/portraits/men/32.jpg", // Male beard pic from ref image
//     price: "₹12,400 Spent",
//     orderCount: 145,
//     percentage: 82,
//   },
//   {
//     name: "Rohan Mehta",
//     pic: "https://randomuser.me/api/portraits/women/44.jpg", // Blonde pic from ref image
//     price: "₹9,800 Spent",
//     orderCount: 110,
//     percentage: 65,
//   },
//   {
//     name: "Ananya Sharma",
//     pic: "https://randomuser.me/api/portraits/men/32.jpg", // Male beard pic from ref image
//     price: "₹12,400 Spent",
//     orderCount: 145,
//     percentage: 82,
//   },
//   {
//     name: "Rohan Mehta",
//     pic: "https://randomuser.me/api/portraits/women/44.jpg", // Blonde pic from ref image
//     price: "₹9,800 Spent",
//     orderCount: 110,
//     percentage: 65,
//   },
//   {
//     name: "Ananya Sharma",
//     pic: "https://randomuser.me/api/portraits/men/32.jpg", // Male beard pic from ref image
//     price: "₹12,400 Spent",
//     orderCount: 145,
//     percentage: 82,
//   },
//   {
//     name: "Rohan Mehta",
//     pic: "https://randomuser.me/api/portraits/women/44.jpg", // Blonde pic from ref image
//     price: "₹9,800 Spent",
//     orderCount: 110,
//     percentage: 65,
//   },
//   {
//     name: "Ananya Sharma",
//     pic: "https://randomuser.me/api/portraits/men/32.jpg", // Male beard pic from ref image
//     price: "₹12,400 Spent",
//     orderCount: 145,
//     percentage: 82,
//   },
//   {
//     name: "Rohan Mehta",
//     pic: "https://randomuser.me/api/portraits/women/44.jpg", // Blonde pic from ref image
//     price: "₹9,800 Spent",
//     orderCount: 110,
//     percentage: 65,
//   },
// ];

interface EnterpriseLoginProps {
  onLogin?: (email: string, pass: string, remember: boolean) => void;
  onForgotPassword?: () => void;
  logoUrl?: string;
  width?: string | number;
  height?: string | number;
}

export const EnterpriseLogin: React.FC<EnterpriseLoginProps> = ({
  onLogin,
  onForgotPassword,
  logoUrl = LOGO,
  width = "600px",
  height = "auto",
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  const [isEmailError, setIsEmailError] = useState<boolean>(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
  const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
  const [user, setUser] = useState<string>(""); // for now string have to be user

  // Convert numeric props to pixel strings
  const cardWidth = typeof width === "number" ? `${width}px` : width;
  const cardHeight = typeof height === "number" ? `${height}px` : height;

  const handleSubmit = () => {
    if (isValid()) {
      onLogin?.(email, password, remember);
      // setUser("not");
      navigate("/dashboard/orders");
    }
  };

  const isValid = () => {
    if (!email) {
      setIsEmailError(true);
      setEmailErrorMessage("Please Enter The Email Address");
    } else if (!emailRegex.test(email)) {
      setIsEmailError(true);
      setEmailErrorMessage("Invalid Email Address");
    } else if (!password) {
      setIsPasswordError(true);
    } else {
      return true;
    }
    return false;
  };

  return (
    <div className="el-page-wrapper">
      {/* <StatisticCard
        title="Total Revenue"
        value="₹1,45,200"
        icon={<FiTrendingUp />}
        trendValue="+12%"
        width="350px"
      />
      <PerformanceBar
        title="Top Purchased Products"
        data={salesData}
        width="750px"
        showMoreOptions={false}
        maxBars={9}
        // onMoreOptionsClick={() => console.log("Show reports menu...")}
      />
      <LeaderboardBar
        title="Top Purchasing Customers"
        data={purchasingData}
        width="450px"
        maxBars={10}
        // onMoreOptionsClick={() => console.log("Show customers menu...")}
        showMoreOptions={false}
      /> */}

      <div
        className="el-card"
        style={
          {
            "--card-width": cardWidth,
            "--card-height": cardHeight,
          } as React.CSSProperties
        }
      >
        <div className="el-logo-wrapper">
          <img src={logoUrl} alt="Portal Logo" className="el-logo" />
        </div>

        <div className="el-header">
          <h1 className="el-title">Admin Portal</h1>
          <p className="el-subtitle">Enterprise Management</p>
        </div>
        {user == "not" && (
          <>
            <span className="el-error">
              Invalid username or password. Please try again
            </span>{" "}
            <br />
            <br />
          </>
        )}
        <div className="el-form">
          <DashboardInput
            label="Email Address"
            type="email"
            placeholder="admin@gmail.com"
            value={email}
            onChange={(val) => {
              setEmail(val);
              setIsEmailError(false);
              setUser("");
            }}
            icon={<FiMail />}
            error={isEmailError}
            errorMessage={emailErrorMessage}
            required
          />

          <DashboardInput
            label="Password"
            type="password"
            placeholder="........"
            value={password}
            onChange={(val) => {
              setPassword(val);
              setIsPasswordError(false);
              setUser("");
            }}
            icon={<FiLock />}
            error={isPasswordError}
            errorMessage="Please Enter Password"
            required
          />

          <div className="el-footer-links">
            <label className="el-checkbox-container">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="el-checkmark"
                hidden
              />
              <span className="el-checkmark"></span>
              Keep me logged in
            </label>
            <button
              type="button"
              className="el-forgot-btn"
              onClick={onForgotPassword}
            >
              Forgot Password?
            </button>
          </div>
          <DashboardButton
            name="Login"
            variant="primary"
            onClick={() => handleSubmit()}
            type="reset"
          />
        </div>
      </div>
    </div>
  );
};

export default EnterpriseLogin;

{
  /* <div className="el-input-group">
            <label className="el-label">EMAIL ADDRESS</label>
            <div className="el-input-wrapper">
              <FiMail className="el-icon" />
              <input
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {isEmailError && <span className="el-error">asdsd</span>}
          </div> */
}

{
  /* <div className="el-input-group">
            <label className="el-label">PASSWORD</label>
            <div className="el-input-wrapper">
              <FiLock className="el-icon" />
              <input
                type="password"
                placeholder="........"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {isPasswordError && <span className="el-error">asdsd</span>}
          </div> */
}
