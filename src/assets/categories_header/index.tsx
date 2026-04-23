import React from "react";
import "./index.css";
import { FiBox, FiPackage, FiTruck, FiUsers, FiPieChart } from "react-icons/fi";

const CATEGORIES = [
  { id: "dryfruits", name: "Dry Fruits", icon: <FiPackage /> },
  { id: "nuts", name: "Nuts", icon: <FiBox /> },
  { id: "dates", name: "Dates", icon: <FiTruck /> },
  { id: "chocolate", name: "Chocolate", icon: <FiUsers /> },
  { id: "freshjuice", name: "Fresh Juice", icon: <FiPieChart /> },
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
