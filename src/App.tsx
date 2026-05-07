import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home, { productsTestData } from "./pages/Home/Home";
import Login from "./pages/Login";
import ConfirmCheckout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders/Orders";
import CategoryProducts, {
  productsData,
} from "./pages/CategoryProducts/categoryProducts";
import Enterprise from "./pages/index";
import MainLayout from "./MainLayout";
import DashboardLayout from "./assets/ui/DashBoardLayout/DashBoardLayout";
import type { NavItem } from "./config/navigation";
import { NAV_OPTIONS } from "./config/navigation";
import ProductDetails from "./pages/Product/Product";
import AuthCard from "./pages/Auth/Auth";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import OrderStatusScreen from "./pages/OrderStatusScreen/OrderStatusScreen";
import DRY_FRUITS from "../data/DRY_FRUITS.png";
import NUTS from "../data/NUTS.png";
import DemoReceiptScreen from "./pages/OrderReceipt/DemoReceiptScreen/DemoReceiptScreen";
import CartTotalCard, {
  CartTotalCardProps,
} from "./pages/CartTotalCard/CardTotalCard";
import { CartItem } from "./assets/cart/CartItems";
import CartScreen from "./pages/Cart/Cart";
import { Order, OrderProps } from "./pages/Order/Order";

const mockOrderData: OrderProps = {
  orderNumber: "DF-98231",
  orderDate: "October 24, 2023 at 10:42 AM",
  status: "Delivered",
  items: [
    {
      name: "Heritage Sourdough Boule",
      variant: "800g Standard",
      quantity: 2,
      price: 12.0,
      thumbnail: DRY_FRUITS,
    },
    {
      name: "Wildflower Raw Honey",
      variant: "500g Jar",
      quantity: 1,
      price: 18.5,
      thumbnail: NUTS,
    },
    {
      name: "Heritage Sourdough Boule",
      variant: "800g Standard",
      quantity: 2,
      price: 12.0,
      thumbnail: DRY_FRUITS,
    },
    {
      name: "Wildflower Raw Honey",
      variant: "500g Jar",
      quantity: 1,
      price: 18.5,
      thumbnail: NUTS,
    },
    {
      name: "Heritage Sourdough Boule",
      variant: "800g Standard",
      quantity: 2,
      price: 12.0,
      thumbnail: DRY_FRUITS,
    },
    {
      name: "Wildflower Raw Honey",
      variant: "500g Jar",
      quantity: 1,
      price: 18.5,
      thumbnail: NUTS,
    },
  ],
  shippingAddress: {
    name: "Eleanor Vance",
    street: "124 Hill House Lane",
    apt: "Apt 3B",
    city: "Berkshire",
    state: "MA",
    zip: "01220",
    country: "United States",
  },
  paymentInfo: {
    method: "Google Pay",
    transactionId: "TXN-88492019-GPAY",
    date: "Oct 24, 2023, 10:42 AM",
  },
  summary: [
    { label: "Subtotal (3 items)", value: 42.5 },
    { label: "Discount (AUTUMN15)", value: -6.38 },
    { label: "Shipping Charges", value: 5.0 },
    { label: "Estimated Tax", value: 3.4 },
    { label: "Total Paid", value: 44.52, isTotal: true },
  ],
};

const mockCartData: CartItem[] = [
  {
    id: "cj_001",
    name: "Organic Jumbo Cashews",
    description: "250g Pack",
    price: "$22.50",
    imageUrl: DRY_FRUITS,
    quantity: 2,
  },
  {
    id: "cj_002",
    name: "Roasted Almonds - Salted",
    description: "150g Pack",
    price: "$18.00",
    imageUrl: NUTS,
    quantity: 1,
  },
  {
    id: "cj_003",
    name: "Organic Jumbo Cashews",
    description: "250g Pack",
    price: "$22.50",
    imageUrl: DRY_FRUITS,
    quantity: 2,
  },
  {
    id: "cj_004",
    name: "Roasted Almonds - Salted",
    description: "150g Pack",
    price: "$18.00",
    imageUrl: NUTS,
    quantity: 1,
  },
  {
    id: "cj_005",
    name: "Organic Jumbo Cashews",
    description: "250g Pack",
    price: "$22.50",
    imageUrl: DRY_FRUITS,
    quantity: 2,
  },
  {
    id: "cj_006",
    name: "Roasted Almonds - Salted",
    description: "150g Pack",
    price: "$18.00",
    imageUrl: NUTS,
    quantity: 1,
  },
  {
    id: "cj_007",
    name: "Organic Jumbo Cashews",
    description: "250g Pack",
    price: "$22.50",
    imageUrl: DRY_FRUITS,
    quantity: 2,
  },
  {
    id: "cj_008",
    name: "Roasted Almonds - Salted",
    description: "150g Pack",
    price: "$18.00",
    imageUrl: NUTS,
    quantity: 1,
  },
  {
    id: "cj_009",
    name: "Organic Jumbo Cashews",
    description: "250g Pack",
    price: "$22.50",
    imageUrl: DRY_FRUITS,
    quantity: 2,
  },
  {
    id: "cj_010",
    name: "Roasted Almonds - Salted",
    description: "150g Pack",
    price: "$18.00",
    imageUrl: NUTS,
    quantity: 1,
  },
  {
    id: "cj_011",
    name: "Organic Jumbo Cashews",
    description: "250g Pack",
    price: "$22.50",
    imageUrl: DRY_FRUITS,
    quantity: 2,
  },
  {
    id: "cj_012",
    name: "Roasted Almonds - Salted",
    description: "150g Pack",
    price: "$18.00",
    imageUrl: NUTS,
    quantity: 1,
  },
];

function App() {
  const renderRoutes: any = (items: NavItem[]) => {
    return items.flatMap((item) => {
      const routes = [];
      if (item.path && item.component) {
        routes.push(
          <Route key={item.id} path={item.path} element={item.component} />,
        );
      }
      if (item.children) {
        routes.push(...renderRoutes(item.children));
      }
      return routes;
    });
  };

  const cartTotalData: CartTotalCardProps = {
    subtotal: "$73.96",
    shipping: "Free",
    discountCode: "FESTIVE10", // Optional, passed as present
    discountAmount: "-$10.00", // Optional, passed as present
    finalTotal: "$63.96",
    onCheckout: () => { },
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/enterprise.com" element={<Enterprise />} />
        <Route path="/receipt" element={<DemoReceiptScreen />} />
        <Route
          path="/cart-total-card"
          element={<CartTotalCard {...cartTotalData} />}
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/order-status"
          element={
            <OrderStatusScreen
              orderData={{
                orderNumber: "12",
                estimatedDeliveryRange: "12",
                items: [
                  { thumbnailUrl: DRY_FRUITS, name: "Dry Fruits" },
                  { thumbnailUrl: NUTS, name: "Nuts" },
                  { thumbnailUrl: DRY_FRUITS, name: "Dry Fruits" },
                  { thumbnailUrl: NUTS, name: "Nuts" },
                  { thumbnailUrl: DRY_FRUITS, name: "Dry Fruits" },
                  { thumbnailUrl: NUTS, name: "Nuts" },
                  { thumbnailUrl: DRY_FRUITS, name: "Dry Fruits" },
                  { thumbnailUrl: NUTS, name: "Nuts" },
                  { thumbnailUrl: DRY_FRUITS, name: "Dry Fruits" },
                  { thumbnailUrl: NUTS, name: "Nuts" },
                  { thumbnailUrl: DRY_FRUITS, name: "Dry Fruits" },
                  { thumbnailUrl: NUTS, name: "Nuts" },
                  { thumbnailUrl: DRY_FRUITS, name: "Dry Fruits" },
                  { thumbnailUrl: NUTS, name: "Nuts" },
                  { thumbnailUrl: DRY_FRUITS, name: "Dry Fruits" },
                  { thumbnailUrl: NUTS, name: "Nuts" },
                  { thumbnailUrl: DRY_FRUITS, name: "Dry Fruits" },
                  { thumbnailUrl: NUTS, name: "Nuts" },
                  { thumbnailUrl: DRY_FRUITS, name: "Dry Fruits" },
                  { thumbnailUrl: NUTS, name: "Nuts" },
                  { thumbnailUrl: DRY_FRUITS, name: "Dry Fruits" },
                  { thumbnailUrl: NUTS, name: "Nuts" },
                ],
                totalItems: 2,
                userEmail: "tester",
                failureReason: "testerfailed",
              }}
              orderStatus="success"
            />
          }
        />

        <Route path="/login" element={<AuthCard />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route
            path="/order/:orderId"
            element={<Order {...mockOrderData} />}
          />
          <Route
            path="/categories/:categoryId/products"
            element={<CategoryProducts />}
          />
          <Route
            path="/products/:productId"
            element={
              <ProductDetails />
            }
          />
          <Route
            path="/cart"
            element={
              <CartScreen
                cartTotal={cartTotalData}
                items={mockCartData}
                productsData={productsTestData}
              />
            }
          />
          <Route path="/order" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/checkout" element={<ConfirmCheckout />} />
        <Route element={<DashboardLayout />}>{renderRoutes(NAV_OPTIONS)}</Route>
        {/* <Route path="/receipt" element={<OrderReceipt
          orderNumber="123"
          date=''
          status="success"
          payment={{
            method: {
              icon: '',
              text: ""
            }, transactionId: ""
          }}
          shipping={{
            name: '',
            phone: "",
            address: ['', '']
          }}
          items={[]}
          pricing={{
            subtotal: '',
            discount: {
              code: "",
              value: ""
            },
            shippingFee: '',
            grandTotal: ''
          }}
          onDownloadCopy={() => { }}
        />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
