import React from "react";
import "./ProductCard.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import image2 from "../../../data/image2.png";
import IconButton from "../icon_button/IconButton";

// --- Interfaces ---

export type ProductCardVariant = "primary" | "secondary" | "outline";
export type ProductCardSize = "small" | "medium" | "large";

import { RiHeart3Line, RiHeart3Fill } from "react-icons/ri";
import { BsSuitHeart } from "react-icons/bs";
import { FiHeart } from "react-icons/fi";

export interface Product {
  id: string | number;
  image: string;
  categoryId: Number;
  title: string;
  description: string;
  price: number;
  weight: number;
  unit: string;
  isFav?: boolean;
}

export interface ProductCardProps {
  products?: Product[];
  height?: string | number;
  width?: string | number;
  fontSize?: string | number;
  variant?: ProductCardVariant;
  size?: ProductCardSize;
  onClickAddToCart: (el: any) => void;
  onClick?: (el: any) => void;
  onToggleFav?: (el: any) => void;
}

// --- Component ---

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
  const cardDynamicStyle: React.CSSProperties = {
    height: typeof height === "number" ? `${height}px` : height,
    width: typeof width === "number" ? `${width}px` : width,
    fontSize: typeof fontSize === "number" ? `${fontSize}px` : fontSize,
  };

  return (
    <section className="product-grid-container">
      {products?.map((product) => (
        <div
          key={product.id}
          className={`product-card product-card--${variant} product-card--${size}`}
          style={cardDynamicStyle}
          onClick={() => onClick?.(product)}
        >
          {/* Image Section */}
          <div className="product-card__image-wrapper">
            <img
              src={product.image}
              alt={product.title}
              className="product-card__image"
            />
            <div
              className={`product-card__fav-btn ${product.isFav ? "is-fav" : ""}`}
              aria-label="Add to favorites"
              style={{ background: "transparent" }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFav?.(product);
              }}
            >
              <IconButton
                icon={!product?.isFav ? <FiHeart /> : <RiHeart3Line />}
                size="medium"
                variant={!product?.isFav ? "primary" : "secondary"}
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="product-card__content">
            <h3 className="product-card__title">{product.title}</h3>
            <p className="product-card__description">{product.description}</p>

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

            {/* Button Section */}
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
  );
};

export default ProductCard;
