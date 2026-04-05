import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosinstance from "../service";

export default function ConfirmCheckout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any>({});
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchUserCart = async () => {
      console.log(user, "asdasd");
      if (user?._id) {
        const res = await axiosinstance.get(`/api/carts/${user?._id}/user`);
        if (res?.data) {
          setCart(res.data);
        }
      }
    };
    fetchUserCart();
  }, [user]);

  const handleClick = async (orderId: any) => {
    try {
      await axiosinstance.put(`api/orders/${orderId}/confirm`);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fdc675",
      }}
    >
      <h2
        onClick={() => navigate("/cart")}
        style={{
          position: "absolute",
          top: "10px",
          left: "15px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        &larr; Go Back
      </h2>

      <div
        style={{
          backgroundColor: "#41bec2",
          padding: "180px",
          borderRadius: "10px",
          width: "900px",
          height: "700px",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <text style={{ margin: "50px", fontSize: "30px" }}>Order Summary</text>
        <div style={{ padding: "20px" }}>
          {cart?.order?.products.map((product: any) => (
            <div
              key={product._id}
              style={{
                border: "0",
                borderRadius: "15px",
                backgroundColor: "#fd9d75",
                marginBottom: "10px",
                padding: "10px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", gap: "9px", flexDirection: "column" }}
              >
                <h3>{product.name}</h3>
                <p>Price: ₹{product.price}</p>
              </div>
            </div>
          ))}
        </div>
        <h2 style={{ marginBottom: "20px" }}>
          Total Price: {cart?.order?.totalPrice}{" "}
        </h2>

        <button
          onClick={() => {
            handleClick(cart?.order?._id);
          }}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor: "#d3fda1",
            color: "#000000",
          }}
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}
