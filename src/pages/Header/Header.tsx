import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import Button from "../../assets/button/Button";
import IconButton from "../../assets/icon_button/IconButton";
import { LOGO } from "../../utils/utils";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { ProductService } from "../../service/product";
import { Product } from "../../entity/product";
import NUTS from "../../../data/NUTS.png";
import { FaSpinner } from "react-icons/fa";
import { User } from "../../entity/user";

interface HeaderProps {
  siteName: string;
  onSearch: (query: string) => void;
  onSignInClick: () => void;
  onCartClick: () => void;
  onEnterpriseSignInClick: () => void;
  height?: string;
}

export const Header: React.FC<HeaderProps> = ({
  siteName,
  onSearch,
  onSignInClick,
  onCartClick,
  onEnterpriseSignInClick,
  height = "70px",
}) => {
  const [query, setQuery] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>({});
  const navigate = useNavigate();
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    onSearch(query);
  };

  const fetchProducts = async (searchQuery: string) => {
    if (!searchQuery) {
      setProducts([]);
      setShowDropdown(false);
      return;
    }

    try {
      setIsLoading(true);
      let result = await new ProductService().getByName(searchQuery);
      setProducts([
        ...result,
        ...result,
        ...result,
        ...result,
        ...result,
        ...result,
        ...result,
        ...result,
        ...result,
        ...result,
        ...result,
        ...result,
        ...result,
        ...result,
        ...result,
      ]);
      setShowDropdown(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchProducts(value.trim());
  };

  const handleProductClick = (productId: string) => {
    setShowDropdown(false);
    setQuery("");
    navigate(`/products/${productId}`);
  };

  return (
    <header className="header-main-header" style={{ height: height }}>
      <div className="header-container">
        <div
          className="header-logo"
          onClick={() => (window.location.href = "/")}
        >
          <div className="header-logo-icon">
            <img className="header-logo-image" src={LOGO} alt="Logo" />
          </div>
          <span className="header-logo-text">{siteName}</span>
        </div>

        <form className="header-search-form" onSubmit={handleSearchSubmit}>
          <div className="search-input-wrapper" ref={searchWrapperRef}>
            <input
              type="text"
              placeholder="Search dry fruits, nuts, juices..."
              value={query}
              onChange={handleInputChange}
              onFocus={() => {
                if (products.length > 0) setShowDropdown(true);
              }}
              className="search-input"
            />
            <div className="search-icons-group">
              {query === "" ? (
                <FiSearch className="search-placeholder-icon" />
              ) : isLoading ? (
                <FaSpinner className="search-spinner" size="1.5em" />
              ) : (
                ""
              )}
            </div>

            {showDropdown && products.length > 0 && (
              <ul className="search-results-dropdown">
                {products.map((product: Product) => (
                  <div className="search-results-items-list">
                    {product ? (
                      <img
                        src={
                          product.images?.length > 0 ? product.images[0] : NUTS
                        }
                        width={"20px"}
                        height={"20px"}
                        style={{ borderRadius: "4px" }}
                      />
                    ) : (
                      <FiSearch className="search-placeholder-icon" />
                    )}
                    <li
                      key={product.id}
                      className="search-result-item"
                      onClick={() => handleProductClick(product.id)}
                    >
                      {product.name || product.title}
                    </li>
                  </div>
                ))}
              </ul>
            )}
          </div>
        </form>

        <div className="header-actions">
          {!user ? (
            <>
              <Button
                name="Sign In"
                variant="outline"
                disabled={false}
                height="40px"
                onClick={onSignInClick}
                icon={<FiUser fontSize="15px" />}
              />
              <Button
                name="Enterprise Sign In"
                variant="outline"
                disabled={false}
                height="40px"
                onClick={onEnterpriseSignInClick}
                icon={<FiUser fontSize="15px" />}
              />
            </>
          ) : (
            <>
              <IconButton
                height="40px"
                icon={<BsFillBoxSeamFill />}
                variant="primary"
                disabled={false}
                size="medium"
                onClick={() => navigate("/orders")}
              />
              <IconButton
                height="40px"
                icon={<FiShoppingCart />}
                variant="primary"
                disabled={false}
                size="medium"
                onClick={onCartClick}
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
