import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosinstance from "../service";

const Cart = () => {
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

  const removeProductFromOrder = async (orderId: any, productId: any) => {
    try {
      await axiosinstance.delete(`api/orders/${orderId}/products/${productId}`);
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          borderBottom: "1px solid gray",
        }}
      >
        <h2 onClick={() => navigate("/")}>&larr; Go Back</h2>

        <div style={{ display: "flex", flexDirection: "row", gap: "9px" }}>
          {user ? (
            <>
              <text
                style={{
                  backgroundColor: "#41bec2",
                  border: "0",
                  borderRadius: "15px",
                  height: "35px",
                  alignContent: "center",
                  textAlign: "center",
                  padding: "10px 15px",
                }}
                onClick={() => {
                  navigate("/profile");
                }}
              >
                {user?.name}
              </text>
              <button
                style={{
                  backgroundColor: "#41bec2",
                  border: "0",
                  borderRadius: "15px",
                  width: "90px",
                  height: "35px",
                }}
                onClick={() => {
                  navigate("/order");
                }}
              >
                Orders
              </button>
              <button
                style={{
                  backgroundColor: "#41bec2",
                  border: "0",
                  borderRadius: "15px",
                  width: "90px",
                  height: "35px",
                }}
              >
                Cart (
                {cart?.order?.products?.length
                  ? cart?.order?.products?.length
                  : 0}
                )
              </button>
              <button
                style={{
                  backgroundColor: "#41bec2",
                  border: "0",
                  borderRadius: "15px",
                  width: "90px",
                  height: "35px",
                }}
                onClick={() => {
                  localStorage.removeItem("user");
                  navigate(0);
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              style={{
                backgroundColor: "#41bec2",
                border: "0",
                borderRadius: "15px",
                width: "90px",
                height: "35px",
              }}
              onClick={() => {
                navigate("/login");
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
      <text style={{ margin: "50px", fontSize: "30px" }}>Products In Cart</text>
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
            <div>
              <button
                style={{
                  backgroundColor: "#96e3a5",
                  border: "0",
                  borderRadius: "15px",
                  width: "90px",
                  height: "35px",
                }}
                onClick={async () => {
                  removeProductFromOrder(cart?.order?._id, product?._id);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      {cart?.order?.products?.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "9px",
            justifyContent: "space-around",
            paddingLeft: "40px",
          }}
        >
          <text
            style={{
              backgroundColor: "#41bec2",
              border: "0",
              borderRadius: "15px",
              height: "35px",
              alignContent: "center",
              textAlign: "center",
              padding: "10px 15px",
            }}
          >
            Total Price : {cart?.order?.totalPrice}
          </text>
          <button
            style={{
              backgroundColor: "#41bec2",
              border: "0",
              borderRadius: "15px",
              width: "130px",
              height: "35px",
              padding: "10px 15px",
              alignContent: "center",
              textAlign: "center",
            }}
            onClick={() => {
              navigate("/checkout");
            }}
          >
            Go to Checkout
          </button>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            marginTop: "100px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            alignItems: "center",
          }}
        >
          <h2>Your cart is empty</h2>
          <button
            style={{
              backgroundColor: "#41bec2",
              border: "0",
              borderRadius: "15px",
              width: "150px",
              height: "35px",
            }}
            onClick={() => {
              navigate("/");
            }}
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
