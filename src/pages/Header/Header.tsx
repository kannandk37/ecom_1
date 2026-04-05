import React, { useState } from "react";
import "./Header.css";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import Button from "../../assets/button/Button";
import IconButton from "../../assets/icon_button/IconButton";
import { LOGO } from "@/src/utils/utils";

interface HeaderProps {
  siteName: string;
  onSearch: (query: string) => void;
  onSignInClick: () => void;
  onCartClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  siteName,
  onSearch,
  onSignInClick,
  onCartClick,
}) => {
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <header className="main-header">
      <div className="header-container">
        {/* Logo Section */}
        <div
          className="header-logo"
          onClick={() => (window.location.href = "/")}
        >
          <div className="logo-icon">
            <img className="logo-image" src={LOGO}></img>
          </div>
          <span className="logo-text">{siteName}</span>
        </div>

        {/* Search Bar Section */}
        <form className="header-search-form" onSubmit={handleSearchSubmit}>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search dry fruits, nuts, juices..."
              value={query}
              onChange={(e) => setQuery(e.target.value?.trim())}
              className="search-input"
            />
            <div className="search-icons-group">
              {query == "" && <FiSearch className="search-placeholder-icon" />}
              <div className="divider" />
              {/* <button type="submit" className="search-submit-btn">
                <FiSearch />
              </button> */}
              <IconButton icon={<FiSearch />} variant="outline" size="small" />
            </div>
          </div>
        </form>

        {/* Actions Section */}
        <div className="header-actions">
          <Button
            name="Sign In"
            variant="outline"
            disabled={false}
            height="40px"
            onClick={onSignInClick}
            icon={<FiUser fontSize="15px" />}
          />
          {/* <button className="signin-btn" onClick={onSignInClick}>
            Sign In <FiUser className="btn-icon" />
          </button> */}
          <IconButton
            height="40px"
            icon={<FiShoppingCart />}
            variant="primary"
            disabled={false}
            size="medium"
            onClick={onCartClick}
          />
          {/* <button className="cart-btn">
            <FiShoppingCart />
          </button> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
