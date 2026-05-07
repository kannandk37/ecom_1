import React, { useState } from "react";
import "./ProductCard.css";
import IconButton from "../icon_button/IconButton";
export type ProductCardVariant = "primary" | "secondary" | "outline";
export type ProductCardSize = "small" | "medium" | "large";
import { RiHeart3Line } from "react-icons/ri";
import { FiHeart } from "react-icons/fi";
import { Product } from "../../entity/product";
import NUTS from "../../../data/NUTS.png";
import LogInOrSignUp from "../dialogue/LogInOrSignUp";

// export interface Product {
//   id: string | number;
//   image: string;
//   categoryId: Number;
//   title: string;
//   description: string;
//   price: number;
//   weight: number;
//   unit: string;
//   isFav?: boolean;
//   name?: string;
//   images: any[];
//   rating?: number;
//   reviews?: number;
//   features?: string[];
//   specs?: { label: string; value: string }[];
//   //temporary
//   quantity?: number;
// }

export interface ProductCardProps {
  products?: Product[];
  height?: string | number;
  width?: string | number;
  fontSize?: string | number;
  variant?: ProductCardVariant;
  size?: ProductCardSize;
  onClickAddToCart: (el: any) => void;
  onClick?: (el: any) => void;
  onToggleFav?: (product: any, variant: any, wishlist: any) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  products,
  height,
  width,
  fontSize,
  variant = "primary",
  size = "small",
  onClick,
  onToggleFav,
  onClickAddToCart,
}) => {
  const [isFav, setIsFav] = useState<boolean>(true);
  const cardDynamicStyle: React.CSSProperties = {
    height: typeof height === "number" ? `${height}px` : height,
    width: typeof width === "number" ? `${width}px` : width,
    fontSize: typeof fontSize === "number" ? `${fontSize}px` : fontSize,
  };
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);

  return (
    <>
      <section className="product-grid-container">
        {products?.map((product) => (
          <div
            key={product.id}
            className={`product-card product-card--${variant} product-card--${size}`}
            style={cardDynamicStyle}
            onClick={() => onClick?.(product)}
          >
            <div className="product-card__image-wrapper">
              <img
                // src={product.images[0]}
                src={NUTS}
                alt={product.title}
                className="product-card__image"
              />
              <div
                className={`product-card__fav-btn ${isFav ? "is-fav" : ""}`}
                aria-label="Add to favorites"
                style={{ background: "transparent" }}
                onClick={(e) => {
                  setIsFav(!isFav);
                  e.stopPropagation();
                  onToggleFav?.(product, '', '');
                }}
              >
                <IconButton
                  icon={!isFav ? <FiHeart /> : <RiHeart3Line />}
                  size="medium"
                  variant={!isFav ? "primary" : "secondary"}
                />
              </div>
            </div>

            <div className="product-card__content">
              <h3 className="product-card__title">{product.title}</h3>
              <p className="product-card__description">{product.shortDescription?.slice(0, 50)}...</p>

              <div className="product-card__info-row">
                <span className="product-card__weight">
                  {product.weight} {product.unit}
                </span>
                <span className="product-card__price">
                  ₹
                  {product.price.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <button
                className="product-card__add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onClickAddToCart?.(product);
                }}
              >
                Add to Cart
                <svg
                  className="product-card__cart-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </section>
      <LogInOrSignUp
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export default ProductCard;
