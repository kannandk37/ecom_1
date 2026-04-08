// import { Revenue } from '@/src/pages/Revenue';
import Orders from "../pages/Order";
// import { Products } from '@/src/pages/pages/Products';
import type { JSX } from "react";
import {
  FiShoppingBag,
  FiDollarSign,
  // FiGrid,
  // FiAward,
  FiBox,
  // FiUsers,
  // FiUserCheck,
  // FiHome,
  // FiLayers,
  // FiPercent,
  // FiSettings,
  // FiLogOut,
  // FiChevronDown,
  // FiChevronLeft,
  // FiChevronRight,
} from "react-icons/fi";
import Products from "../pages/Products/Products";
import Home from "../pages/Home/Home";
export interface NavItem {
  id: string;
  name: string;
  icon: JSX.Element;
  path?: string;
  component?: JSX.Element;
  children?: NavItem[];
}

export const NAV_OPTIONS: NavItem[] = [
  {
    id: "orders",
    name: "Orders",
    icon: <FiShoppingBag />,
    path: "/dashboard/orders",
    component: <Orders />,
    // children: [
    //   {
    //     id: "all-orders",
    //     name: "All Orders",
    //     icon: <FiBox />,
    //     path: "/dashboard/orders",
    //     component: <Orders />,
    //   },
    // ],
  },
  {
    id: "revenue",
    name: "Revenue",
    icon: <FiDollarSign />,
    path: "/dashboard/revenue",
    component: <Home />,
  },
  {
    id: "products",
    name: "Products",
    icon: <FiBox />,
    path: "/dashboard/products",
    component: <Products />,
  },
];

// export const NAV_OPTIONS: SidebarOption[] = [
//   {
//     id: "orders",
//     name: "Orders",
//     icon: <FiShoppingBag />,
//     component: <Orders />,
//     children: [
//       {
//         id: "pending",
//         name: "Pending",
//         icon: <FiLayers />,
//         path: "/orders/pending",
//       },
//       {
//         id: "completed",
//         name: "Completed",
//         icon: <FiAward />,
//         path: "/orders/completed",
//       },
//     ],
//   },
//   { id: "revenue", name: "Revenue", icon: <FiDollarSign />, path: "/revenue" },
//   {
//     id: "categories",
//     name: "Categories",
//     icon: <FiGrid />,
//     path: "/categories",
//   },
//   { id: "brands", name: "Brands", icon: <FiAward />, path: "/brands" },
//   { id: "products", name: "Products", icon: <FiBox />, path: "/products" },
//   { id: "users", name: "Users", icon: <FiUsers />, path: "/users" },
//   {
//     id: "customers",
//     name: "Customers",
//     icon: <FiUserCheck />,
//     path: "/customers",
//   },
//   { id: "warehouse", name: "Warehouse", icon: <FiHome />, path: "/warehouse" },
//   {
//     id: "inventory",
//     name: "Inventory",
//     icon: <FiLayers />,
//     path: "/inventory",
//   },
//   { id: "offers", name: "Offers", icon: <FiPercent />, path: "/offers" },
// ];
