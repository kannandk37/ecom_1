import React from "react";
import "./Orders.css";
import OrderItemsCard, {
  OrderItem,
} from "../../assets/orderitemscard/OrderItemsCard"; // Assuming OrderItems is in the same directory
import DRY_FRUITS from "../../../data/DRY_FRUITS.png";
import DATES from "../../../data/DATES.png";
import NUTS from "../../../data/NUTS.png";
import { useNavigate } from "react-router-dom";

const mockOrdersData: OrderItem[] = [
  {
    id: "#DF-98231",
    status: "Delivered",
    date: "Oct 24, 2024",
    totalPrice: "4,225.00",
    address: "42 Lavender Lane, Botanical Gardens, Bangalore, 560004",
    itemThumbnails: [DRY_FRUITS, DATES, NUTS, DRY_FRUITS, DATES],
  },
  {
    id: "#DF-98104",
    status: "In Process",
    date: "Oct 22, 2024",
    totalPrice: "1,850.00",
    address: "88 Heritage Street, Fort Area, Mumbai, 400001",
    itemThumbnails: [DRY_FRUITS],
    itemDescription: "Himalayan Green Tea (250g)",
  },
  {
    id: "#DF-97882",
    status: "Pending Payment",
    date: "Oct 15, 2024",
    totalPrice: "5,100.00",
    address: "15 Sunrise Boulevard, IT Park, Pune, 411057",
    itemThumbnails: [
      DRY_FRUITS,
      DATES,
      NUTS,
      DRY_FRUITS,
      DATES,
      DRY_FRUITS,
      DATES,
      NUTS,
      DRY_FRUITS,
      DATES,
    ],
  },
];

const Orders: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="orders-page" style={{ fontFamily: "var(--font-family)" }}>
      <main className="orders-main-content">
        <div className="content-wrapper">
          <nav className="breadcrumbs">
            <span onClick={() => navigate("/")}>Home</span> &gt;{" "}
            <span className="active-crumb">Orders</span>
          </nav>
          <h1 className="orders-title">My Orders</h1>
          <OrderItemsCard orders={mockOrdersData} />
        </div>
      </main>
    </div>
  );
};

export default Orders;
