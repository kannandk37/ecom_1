import React from "react";
import "./index.css";
import { FiBox, FiPackage, FiTruck, FiUsers, FiPieChart } from "react-icons/fi";

const CATEGORIES = [
  { id: "nuts", name: "Nuts & Seeds", icon: <FiBox /> },
  { id: "dried", name: "Dried Fruits", icon: <FiPackage /> },
  { id: "exotic", name: "Exotic Mix", icon: <FiTruck /> },
  { id: "offers", name: "Bulk Offers", icon: <FiUsers /> },
  { id: "best", name: "Best Sellers", icon: <FiPieChart /> },
];

const AuthHeader: React.FC = () => {
  return (
    <header className="auth-header">
      <div className="header-inner">
        <div className="category-nav">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="nav-item">
              {/* <span className="nav-icon">{cat.icon}</span> */}
              <span className="nav-text">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
