import React from "react";
import "./index.css";
import { FiBox, FiPackage, FiTruck, FiUsers, FiPieChart } from "react-icons/fi";
import { LOGO, siteName } from "../../utils/utils";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { id: "dryfruits", name: "Dry Fruits", icon: <FiPackage /> },
  { id: "nuts", name: "Nuts", icon: <FiBox /> },
  { id: "dates", name: "Dates", icon: <FiTruck /> },
  { id: "chocolate", name: "Chocolate", icon: <FiUsers /> },
  { id: "freshjuice", name: "Fresh Juice", icon: <FiPieChart /> },
];

interface AuthHeaderProps {
  marginTop?: string
}

const AuthHeader = ({ marginTop = '70px' }: AuthHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="category-auth-header" style={{ marginTop: marginTop }}>
      <div className="category-auth-header-logo" onClick={() => navigate("/")}>
        <div className="category-auth-logo-icon">
          <img className="category-auth-logo-image" src={LOGO}></img>
        </div>
        <span className="category-auth-logo-text">{siteName}</span>
      </div>
      <div className="category-header-inner">
        <div className="category-category-nav">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="category-nav-item">
              {/* <span className="category-nav-icon">{cat.icon}</span> */}
              <span className="category-nav-text">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
