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
import EnterpriseLogin from "./pages/EnterpriseLogin";
import MainLayout from "./MainLayout";
import { DashboardLayout } from "@/src/assets/ui/DashBoardLayout/DashBoardLayout";
import type { NavItem } from "./config/navigation";
import { NAV_OPTIONS } from "./config/navigation";
import ProductDetails from "./pages/Product";

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
        <Route path="/enterprise" element={<EnterpriseLogin />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
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
        {/* DASHBOARD SHELL */}
        <Route element={<DashboardLayout />}>{renderRoutes(NAV_OPTIONS)}</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
