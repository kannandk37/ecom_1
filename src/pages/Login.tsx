import { useState, useEffect } from "react";
import axiosinstance from "../service";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { LOGO } from "../utils/utils";
import { FiLock, FiMail } from "react-icons/fi";
import DashboardInput from "../assets/ui/DashBoardInput/DashBoardInput";
import DashboardButton from "../assets/ui/DashBoardButton/DashBoardButton";

interface LoginProps {
  onLogin?: (email: string, pass: string, remember: boolean) => void;
  onSignUp?: (
    email: string,
    pass: string,
    mobile: string,
    remember?: boolean,
  ) => void;
  onForgotPassword?: () => void;
  logoUrl?: string;
  width?: string | number;
  height?: string | number;
}

const Login: React.FC<LoginProps> = ({
  onLogin,
  onSignUp,
  onForgotPassword,
  logoUrl = LOGO,
  width = "600px",
  height = "auto",
}) => {
  const [name, setName] = useState<any>("");
  const [email, setEmail] = useState<any>("");
  const [mobile, setMobile] = useState<any>("");
  const [password, setPassword] = useState<any>("");
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isUserAlreadyExists, setISUserAlreadyExists] =
    useState<boolean>(false);

  const [isLoginRequire, setIsLoginRequire] = useState<boolean>(false);
  const [user, setUser] = useState<string>(""); // for now string have to be user
  const [isEmailError, setIsEmailError] = useState<boolean>(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
  const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(false);

  const handleSubmit = () => {};
  // Convert numeric props to pixel strings
  const cardWidth = typeof width === "number" ? `${width}px` : width;
  const cardHeight = typeof height === "number" ? `${height}px` : height;

  const signUp = async () => {
    try {
      if (email && name && password) {
        let userData = {
          name: name,
          email: email,
          password: password,
        };
        let user = await axiosinstance.post("/api/signup", userData);
        if (user.data?._id) {
          localStorage.setItem("user", JSON.stringify(user.data));
          navigate("/");
        } else if (user.data == "user already exists") {
          setISUserAlreadyExists(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const login = async () => {
    try {
      if (email && password) {
        let user = await axiosinstance.post("/api/login", {
          email: email,
          password: password,
        });
        if (user.data?._id) {
          localStorage.setItem("user", JSON.stringify(user.data));
          navigate("/");
        } else if (user?.data == "user doesnot exists") {
          setIsLoginRequire(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isUserAlreadyExists) {
      const timer = setTimeout(() => {
        setISUserAlreadyExists(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isUserAlreadyExists]);

  useEffect(() => {
    if (isLoginRequire) {
      const timer = setTimeout(() => {
        setIsLoginRequire(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLoginRequire]);

  return (
    <>
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
      <div
        style={{
          width: "100vw",
          height: "100vh",
          // backgroundColor: "black",
          alignContent: "center",
          justifyItems: "center",
        }}
      >
        {isSignUp ? (
          <h1 style={{ marginBottom: "40px" }}>Sign Up</h1>
        ) : (
          <h1 style={{ marginBottom: "40px" }}>Login</h1>
        )}

        {/* <form> */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {isSignUp && (
            <input
              style={{ width: "350px", height: "50px", padding: "15px" }}
              type="text"
              value={name}
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            style={{ width: "350px", height: "50px", padding: "15px" }}
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={{ width: "350px", height: "50px", padding: "15px" }}
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "15px",
              justifyContent: "center",
            }}
          >
            <button
              type="submit"
              style={{
                marginTop: "15px",
                width: "140px",
                height: "50px",
                border: 0,
                borderRadius: "15px",
              }}
              onClick={async () => {
                setIsSignUp(false);
                await login();
              }}
            >
              Login
            </button>
            <button
              type="submit"
              style={{
                marginTop: "15px",
                width: "140px",
                height: "50px",
                border: 0,
                borderRadius: "15px",
              }}
              onClick={async () => {
                setIsSignUp(true);
                await signUp();
              }}
            >
              SignUp
            </button>
          </div>
          {isUserAlreadyExists && <p>User Already Exists!</p>}
          {isLoginRequire && <p>User Doesn't Exists Please Sign Up!</p>}
        </div>
        {/* </form> */}
      </div>
    </>
  );
};

export default Login;
