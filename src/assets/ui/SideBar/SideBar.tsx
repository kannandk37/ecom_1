// import React, { useState, useEffect, type ReactNode } from "react";
import "./SideBar.css";
// import {
//   FiShoppingBag,
//   FiDollarSign,
//   FiGrid,
//   FiAward,
//   FiBox,
//   FiUsers,
//   FiUserCheck,
//   FiHome,
//   FiLayers,
//   FiPercent,
//   FiSettings,
//   FiLogOut,
//   FiChevronDown,
//   FiChevronLeft,
//   FiChevronRight,
// } from "react-icons/fi";
// import Orders from "@/src/pages/Order";

// // 1. Define Types for Navigation
// interface SidebarOption {
//   id: string;
//   name: string;
//   icon: React.ReactNode;
//   path?: string;
//   children?: SidebarOption[];
//   component?: ReactNode; // For Dropdowns
// }

// interface SidebarProps {
//   isCollapsed: boolean;
//   onToggle: () => void;
//   onOptionSelect?: (id: string) => void;
//   onLogout?: () => void;
//   defaultActiveId?: string;
// }

// // 2. Navigation Data Structure
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

// export const Sidebar: React.FC<SidebarProps> = ({
//   isCollapsed,
//   onToggle,
//   onOptionSelect,
//   onLogout,
//   defaultActiveId = "products",
// }) => {
//   const [activeId, setActiveId] = useState(defaultActiveId);
//   const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

//   // Toggle Dropdown visibility
//   const toggleDropdown = (id: string) => {
//     if (isCollapsed) return; // Don't open dropdowns if collapsed
//     setOpenDropdowns((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
//     );
//   };

//   const handleNavClick = (option: SidebarOption) => {
//     if (option.children) {
//       toggleDropdown(option.id);
//     } else {
//       setActiveId(option.id);
//       onOptionSelect?.(option.id);
//     }
//   };

//   return (
//     <aside className={`sidebar ${isCollapsed ? "collapsed" : "expanded"}`}>
//       {/* 3. TOGGLE BUTTON */}
//       <button
//         className="sidebar-toggle-btn"
//         onClick={onToggle}
//         aria-label="Toggle Sidebar"
//       >
//         {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
//       </button>

//       {/* 4. BRANDING SECTION */}
//       <div className="sidebar-brand">
//         <div className="brand-logo">
//           <FiBox size={24} color="white" />
//         </div>
//         {!isCollapsed && (
//           <div className="brand-text">
//             <h2>Nature's Candy</h2>
//             <p>Admin Panel</p>
//           </div>
//         )}
//       </div>

//       {/* 5. MAIN NAVIGATION */}
//       <nav className="sidebar-nav">
//         {NAV_OPTIONS.map((option) => {
//           const hasChildren = !!option.children?.length;
//           const isOpen = openDropdowns.includes(option.id);
//           const isActive =
//             activeId === option.id ||
//             option.children?.some((c) => c.id === activeId);

//           return (
//             <div key={option.id} className="nav-group">
//               <button
//                 className={`nav-item ${isActive ? "active" : ""}`}
//                 onClick={() => handleNavClick(option)}
//               >
//                 <span className="nav-icon">{option.icon}</span>
//                 {!isCollapsed && (
//                   <span className="nav-text">{option.name}</span>
//                 )}

//                 {hasChildren && !isCollapsed && (
//                   <FiChevronDown
//                     className={`chevron ${isOpen ? "rotated" : ""}`}
//                   />
//                 )}
//               </button>

//               {/* DROPDOWN CHILDREN */}
//               {hasChildren && !isCollapsed && (
//                 <div className={`dropdown-container ${isOpen ? "open" : ""}`}>
//                   {option.children?.map((child) => (
//                     <button
//                       key={child.id}
//                       className={`sub-nav-item ${activeId === child.id ? "active" : ""}`}
//                       onClick={() => {
//                         setActiveId(child.id);
//                         onOptionSelect?.(child.id);
//                       }}
//                     >
//                       <span className="sub-icon">{child.icon}</span>
//                       <span className="nav-text">{child.name}</span>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </nav>

//       {/* 6. FOOTER SECTION */}
//       <div className="sidebar-footer">
//         <button
//           className="nav-item"
//           onClick={() => onOptionSelect?.("settings")}
//         >
//           <span className="nav-icon">
//             <FiSettings />
//           </span>
//           {!isCollapsed && <span className="nav-text">Settings</span>}
//         </button>
//         <button className="nav-item logout" onClick={onLogout}>
//           <span className="nav-icon">
//             <FiLogOut />
//           </span>
//           {!isCollapsed && <span className="nav-text">Logout</span>}
//         </button>
//       </div>
//     </aside>
//   );
// };

import { useLocation, useNavigate } from "react-router-dom";
import { NAV_OPTIONS } from "../../../config/navigation";
import DashboardButton from "../DashBoardButton/DashBoardButton";
import { FiAlignJustify } from "react-icons/fi";
import { LOGO, siteName } from "../../../utils/utils";
import { useEffect, useState } from "react";

export const Sidebar = ({ isCollapsed, onToggle }: any) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLabel, setShowLabel] = useState<boolean>(!isCollapsed);

  useEffect(() => {
    if (!isCollapsed) {
      const timer = setTimeout(() => setShowLabel(true), 100);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowLabel(false), 90);
      return () => clearTimeout(timer);
      //   setShowLabel(false);
    }
  }, [isCollapsed]);

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : "expanded"}`}>
      <div className="sidebar-header">
        {/* 1. TOGGLE BUTTON FIRST */}
        <div className="toggle-wrapper">
          <DashboardButton
            name=""
            icon={<FiAlignJustify size={22} />}
            variant="primary"
            onClick={onToggle}
            type="button"
            height="45px"
            width="45px"
          />
        </div>

        {/* 2. LOGO & NAME (Grouped to collapse together) */}
        <div
          className={`branding-wrapper ${isCollapsed ? "collapsed-branding" : ""}`}
          onClick={() => navigate("/dashboard/orders")}
        >
          <div className="logo-icon">
            <img className="logo-image" src={LOGO} alt="logo" />
          </div>
          <span className="logo-text">{siteName}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_OPTIONS.map((item) => (
          <div key={item.id} className="nav-item-wrapper">
            <DashboardButton
              icon={item.icon}
              name={showLabel ? item.name : ""}
              variant="primary"
              onClick={() => item.path && navigate(item.path)}
              showBg={location.pathname === item.path}
              type="button"
              width="100%"
              side="flex-start"
            />
          </div>
        ))}
      </nav>
    </aside>
  );
};
