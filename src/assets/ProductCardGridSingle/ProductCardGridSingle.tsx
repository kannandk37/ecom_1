import React from "react";
import "./ProductCardGridSingle.css";
import Button from "../button/Button";

// --- Interfaces ---

export interface Product {
  id: string | number;
  name: string;
  image: string;
  price: number;
}

export interface ProductCardProps {
  /** Individual product data object */
  product: Product;
  /** Width for the individual card (default 240px) */
  width?: number | string;
  /** Height for the image area (default 180px) */
  height?: number | string;
  /** Optional click handler for the entire card */
  onClick?: (id: string | number) => void;
}

// --- Component ---

export const ProductCardGridSingle: React.FC<ProductCardProps> = ({
  product,
  width = "240px",
  height = "180px",
  onClick,
}) => {
  const cardStyle: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
  };

  const imageStyle: React.CSSProperties = {
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      className="pc-single-card"
      style={cardStyle}
      onClick={() => onClick?.(product.id)}
    >
      {/* Image Area */}
      <div className="pc-single-card__image-container" style={imageStyle}>
        <img
          src={product.image}
          alt={product.name}
          className="pc-single-card__img"
        />
      </div>

      {/* Info Area */}
      <div className="pc-single-card__body">
        <h3 className="pc-single-card__title">{product.name}</h3>

        <div className="pc-single-card__footer">
          <span className="pc-single-card__price">
            ${product.price.toFixed(2)}
          </span>

          {/* <button
            className="pc-single-card__btn"
            onClick={(e) => {
              e.stopPropagation(); // Prevents card onClick from firing
              console.log(`Added ${product.id} to cart`);
            }}
          >
            Add to Cart
          </button> */}
          <Button
            name={"Add to Cart"}
            disabled={false}
            onClick={() => console.log("")}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCardGridSingle;
