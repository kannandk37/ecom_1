import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosinstance from "../service";

const Orders = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any>({});
  const [orders, setOrders] = useState<any>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchUserCart = async () => {
      try {
        if (user?._id) {
          const res = await axiosinstance.get(`/api/carts/${user?._id}/user`);
          if (res?.data) {
            setCart(res.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchOrders = async () => {
      try {
        if (user?._id) {
          const res = await axiosinstance.get(`/api/orders/${user?._id}/user`);
          if (res?.data) {
            setOrders(res.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserCart();
    fetchOrders();
  }, [user]);

  // const removeProductFromOrder = async (orderId: any, productId: any) => {
  //   try {
  //     await axiosinstance.delete(`api/orders/${orderId}/products/${productId}`);
  //     navigate(0);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
                  navigate(0);
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
                onClick={() => {
                  navigate("/cart");
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
                  navigate("/");
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
      <text style={{ margin: "50px", fontSize: "30px" }}>Previous Orders</text>
      {orders?.length > 0 ? (
        <div style={{ padding: "20px" }}>
          {orders?.map((order: any) => (
            <div
              key={order._id}
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
                <p>Total Price: ₹ {order.totalPrice}</p>
                <p>Payment Status: {order.status}</p>
              </div>
              <div>
                {order.products?.map((product: any) => {
                  return (
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
                        style={{
                          display: "flex",
                          gap: "9px",
                          flexDirection: "column",
                        }}
                      >
                        <h3>{product.name}</h3>
                        <p>Price: ₹{product.price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
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
          <h2>No Previous Orders</h2>
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

export default Orders;
