import React from "react";
import "./ProductCardGridSingle.css";
import Button from "../button/Button";
import { Product } from "../../entity/product";
import NUTS from '../../../data/NUTS.png';

export interface ProductCardProps {
  product: Product;
  width?: number | string;
  height?: number | string;
  onClick?: (id: string | number) => void;
}

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
      <div className="pc-single-card__image-container" style={imageStyle}>
        <img
          src={product.images?.length > 0 ? product?.images[0] : NUTS}
          alt={product.name}
          className="pc-single-card__img"
        />
      </div>

      <div className="pc-single-card__body">
        <h3 className="pc-single-card__title">{product.name}</h3>

        <div className="pc-single-card__footer">
          <span className="pc-single-card__price">
            ₹{product?.variants[0]?.price.toFixed(2)}
          </span>

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
