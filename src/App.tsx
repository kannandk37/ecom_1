import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import ConfirmCheckout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Orders from "./pages/Order";
import CategoryProducts, {
  productsData,
} from "./pages/CategoryProducts/categoryProducts";
// import Product from "./pages/Products/Products";
import Enterprise from "./pages/index";
import MainLayout from "./MainLayout";
import DashboardLayout from "./assets/ui/DashBoardLayout/DashBoardLayout";
import type { NavItem } from "./config/navigation";
import { NAV_OPTIONS } from "./config/navigation";
import ProductDetails from "./pages/Product";
import AuthCard from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import OrderStatusScreen from "./pages/OrderStatusScreen/OrderStatusScreen";
import DRY_FRUITS from "../data/DRY_FRUITS.png";
import NUTS from "../data/NUTS.png";
import OrderReceipt from "./pages/OrderReceipt/OrderReceipt";
import DemoReceiptScreen from "./pages/OrderReceipt/DemoReceiptScreen/DemoReceiptScreen";

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

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/enterprise"
          element={
            <Enterprise
              onForgotPassword={() => {
                /** TODO: need to navigate to screen saying email sent*/
              }}
            />
          }
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

        <Route path="/receipt" element={<DemoReceiptScreen />} />

        <Route element={<MainLayout />}>
          <Route path="/login" element={<AuthCard />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/categories/:categoryId/products"
            element={<CategoryProducts />}
          />
          <Route
            path="/products/:productId"
            element={
              <ProductDetails
                productData={
                  //   {
                  //   id: "sdf",
                  //   name: "adfa",
                  //   price: "12",
                  //   rating: 2,
                  //   reviews: 12,
                  //   weight: "12",
                  //   description: "sdfsd",
                  //   features: [],
                  //   specs: [{ label: "asd", value: "asd" }],
                  //   images: ["asd", "fgdf"],
                  // }
                  productsData[5]
                }
              />
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/checkout" element={<ConfirmCheckout />} />
        <Route element={<DashboardLayout />}>{renderRoutes(NAV_OPTIONS)}</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
