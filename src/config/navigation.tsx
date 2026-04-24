import { Order, OrderProps } from "../pages/Order/Order";
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
import DRY_FRUITS from "../../data/DRY_FRUITS.png";
import NUTS from "../../data/NUTS.png";
import DATES from "../../data/DATES.png";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { MdOutlineCategory } from "react-icons/md";
import { TbBrandBitbucket } from "react-icons/tb";
import DashBoardCategories from "../pages/DashBoard/Categories/DashBoardCategories";
import DashBoardOrders from "../pages/DashBoard/Orders/DashBoardOrders";
import Orders from "../pages/Orders/Orders";
import CreateOrEditCategory from "../pages/Category/CreateOrEditCategory/CreateOrEditCategory";
import CreateOrEditBrand from "../pages/Brand/CreateOrEditBrand/CreateOrEditBrand";
export interface NavItem {
  id: string;
  name: string;
  icon: JSX.Element;
  path?: string;
  component?: JSX.Element;
  children?: NavItem[];
}
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
export const NAV_OPTIONS: NavItem[] = [
  {
    id: "orders",
    name: "Orders",
    icon: <FiShoppingBag />,
    path: "/dashboard/orders",
    component: <DashBoardOrders />,
    children: [
      {
        id: "all-orders",
        name: "All Orders",
        icon: <FiBox />,
        path: "/dashboard/orders",
        component: <Orders />,
      },
    ],
  },
  {
    id: "revenue",
    name: "Revenue",
    icon: <FaIndianRupeeSign />,
    path: "/dashboard/revenue",
    component: <Home />,
  },
  {
    id: "categories",
    name: "Categories",
    icon: <MdOutlineCategory />,
    path: "/dashboard/categories",
    // component: <DashBoardCategories />,
    component: <CreateOrEditCategory />,
  },
  {
    id: "brands",
    name: "Brands",
    icon: <TbBrandBitbucket />,
    path: "/dashboard/brands",
    component: <CreateOrEditBrand />,
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
