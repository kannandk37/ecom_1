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
import { FaIndianRupeeSign, FaRegUser, FaUser } from "react-icons/fa6";
import { MdOutlineCategory } from "react-icons/md";
import { TbBrandBitbucket } from "react-icons/tb";
import DashBoardOrders from "../pages/DashBoard/Orders/DashBoardOrders";
import Orders from "../pages/Orders/Orders";
import CreateOrEditCategory from "../pages/DashBoard/Categories/CreateOrEditCategory/CreateOrEditCategory";
import CategoryList from "../pages/DashBoard/Categories/CategoryList/CategorysList";
import CreateOrEditProduct from "../pages/DashBoard/Products/CreateOrEditProduct/CreateOrEditProduct";
import CreateOrEditVariant from "../pages/DashBoard/Variants/CreateOrEditVariant/createOrEditVariant";
import UsersList from "../pages/DashBoard/Users/UsersList/UsersList";
import { LuPackagePlus, LuPackageSearch, LuWarehouse } from "react-icons/lu";
import { CiBoxes } from "react-icons/ci";
import ManageStock from "../pages/DashBoard/Inventories/ManageStock/ManageStock";
import BrandsList from "../pages/DashBoard/Brands/BrandsList/BrandsList";
import CreateOrEditBrand from "../pages/DashBoard/Brands/CreateOrEditBrand/CreateOrEditBrand";
import ProductsList from "../pages/DashBoard/Products/ProductsList/ProductsList";
import VariantsList from "../pages/DashBoard/Variants/VariantsList/VariantsList";
import CreateOrEditUser from "../pages/DashBoard/Users/CreateOrEditUser/CreateOrEditUser";
import CreateOrEditWareHouse from "../pages/DashBoard/Warehouses/CreateOrEditWareHouse/CreateOrEditWareHouse";
import WarehousesList from "../pages/DashBoard/Warehouses/WarehousesList/WarehousesList";
import InventoriesList from "../pages/DashBoard/Inventories/InventoriesList/InventoriesList";
import AddProductToInventory from "../pages/DashBoard/Inventories/AddProductsToInventory/AddProductsToInventory";

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
    component: <CategoryList />,
    children: [
      {
        id: "add-categories",
        name: "Add Categories",
        icon: <MdOutlineCategory />,
        path: "/dashboard/categories/add",
        component: <CreateOrEditCategory />,
      },
      {
        id: "edit-categories",
        name: "Edit Categories",
        icon: <MdOutlineCategory />,
        path: "/dashboard/categories/edit/:id",
        component: <CreateOrEditCategory />,
      },
    ],
  },
  {
    id: "brands",
    name: "Brands",
    icon: <TbBrandBitbucket />,
    path: "/dashboard/brands",
    component: <BrandsList />,
    children: [
      {
        id: "add-brands",
        name: "Add Brands",
        icon: <TbBrandBitbucket />,
        path: "/dashboard/brands/add",
        component: <CreateOrEditBrand />,
      },
      {
        id: "edit-brands",
        name: "Edit Brands",
        icon: <TbBrandBitbucket />,
        path: "/dashboard/brands/edit/:id",
        component: <CreateOrEditBrand />,
      },
    ],
  },
  {
    id: "products",
    name: "Products",
    icon: <FiBox />,
    path: "/dashboard/products",
    component: <ProductsList />,
    children: [
      {
        id: "add-products",
        name: "Add Products",
        icon: <FiBox />,
        path: "/dashboard/products/add",
        component: <CreateOrEditProduct />,
      },
      {
        id: "edit-products",
        name: "Edit Products",
        icon: <FiBox />,
        path: "/dashboard/products/edit/:id",
        component: <CreateOrEditProduct />,
      },
    ],
  },
  {
    id: "variants",
    name: "Variants",
    icon: <CiBoxes />,
    path: "/dashboard/variants",
    component: <VariantsList />,
    children: [
      {
        id: "add-variants",
        name: "Add Variants",
        icon: <FiBox />,
        path: "/dashboard/variants/add",
        component: <CreateOrEditVariant />,
      },
      {
        id: "edit-variants",
        name: "Edit Variants",
        icon: <FiBox />,
        path: "/dashboard/variants/edit/:id",
        component: <CreateOrEditVariant />,
      },
    ],
  },
  {
    id: "users",
    name: "Users",
    icon: <FaRegUser />,
    path: "/dashboard/users",
    component: <UsersList />,
    children: [
      {
        id: "add-users",
        name: "Add Users",
        icon: <FaRegUser />,
        path: "/dashboard/users/add",
        component: <CreateOrEditUser />,
      },
      {
        id: "edit-users",
        name: "Edit Users",
        icon: <FaRegUser />,
        path: "/dashboard/users/edit/:id",
        component: <CreateOrEditUser />,
      },
    ],
  },
  {
    id: "warehouses",
    name: "WareHouses",
    icon: <LuWarehouse />,
    path: "/dashboard/warehouses",
    component: <WarehousesList />,
    children: [
      {
        id: "add-warehouses",
        name: "Add Warehouses",
        icon: <LuWarehouse />,
        path: "/dashboard/Warehouses/add",
        component: <CreateOrEditWareHouse />,
      },
      {
        id: "edit-warehouses",
        name: "Edit Warehouses",
        icon: <LuWarehouse />,
        path: "/dashboard/Warehouses/edit/:id",
        component: <CreateOrEditWareHouse />,
      },
    ],
  },
  {
    id: "Inventories",
    name: "Inventory",
    icon: <LuPackagePlus />,
    path: "/dashboard/inventories",
    component: <InventoriesList />,
    children: [
      {
        id: "add-product-to-inventory",
        name: "Add Product To Inventory",
        icon: <FiBox />,
        path: "/dashboard/inventory/add-product",
        component: <AddProductToInventory />,
      },
      {
        id: "edit-product-to-inventory",
        name: "Edit Product To Inventory",
        icon: <FiBox />,
        path: "/dashboard/inventory/edit-product/:id",
        component: <AddProductToInventory />,
      },
      {
        id: "manage-stock",
        name: "Manage Stock",
        icon: <LuPackageSearch />,
        path: "/dashboard/manage-stock",
        component: <ManageStock />,
      },
    ],
  },
];

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
