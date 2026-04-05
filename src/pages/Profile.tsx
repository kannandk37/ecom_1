import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <p>No user data found</p>;
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "32px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <h2
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: "10px",
          left: "15px",
          cursor: "pointer",
          fontSize: "32px",
        }}
      >
        &larr; Go Back
      </h2>
      <div
        style={{
          width: "650px",
          padding: "30px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Profile</h2>

        <p>
          <strong>Name:</strong> {user.name}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
    </div>
  );
}
