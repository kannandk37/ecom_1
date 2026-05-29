import React from "react";
import "./ProductCardGrid.css";
import { Product } from "../../entity/product";
import NUTS from '../../../data/NUTS.png';
export interface ProductCardGridProps {
  width?: number | string;
  height?: number | string;
  products: Product[];
}

export const ProductCardGrid: React.FC<ProductCardGridProps> = ({
  width = "240px",
  height = "180px",
  products = [],
}) => {
  const cardStyle: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
  };

  const imageStyle: React.CSSProperties = {
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div className="pc-grid">
      {products.map((product) => (
        <div key={product.id} className="pc-card" style={cardStyle}>
          <div className="pc-card__image-container" style={imageStyle}>
            <img
              src={product?.images?.length > 0 ? product?.images[0] : NUTS}
              alt={product.name}
              className="pc-card__img"
            />
          </div>

          <div className="pc-card__body">
            <h3 className="pc-card__title">{product.name}</h3>

            <div className="pc-card__footer">
              <span className="pc-card__price">
                ₹{product.variants[0]?.price ? product.variants[0]?.price?.toFixed(2) : 0.00}
              </span>

              <button
                className="pc-card__btn"
                onClick={() => console.log(`Added ${product.id} to cart`)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCardGrid;
