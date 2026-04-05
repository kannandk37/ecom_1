import { useState, useEffect } from "react";
import axiosinstance from "../service";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [name, setName] = useState<any>("");
  const [email, setEmail] = useState<any>("");
  const [password, setPassword] = useState<any>("");
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isUserAlreadyExists, setISUserAlreadyExists] =
    useState<boolean>(false);

  const [isLoginRequire, setIsLoginRequire] = useState<boolean>(false);

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
  );
};

export default Login;
