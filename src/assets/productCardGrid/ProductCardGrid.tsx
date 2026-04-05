import React from "react";
import "./ProductCardGrid.css";

// --- Interfaces ---

export interface Product {
  id?: string | number;
  productName: string;
  image: string;
  price: number;
}

export interface ProductCardGridProps {
  /** Width for each individual card (default 75px) */
  width?: number | string;
  /** Height for the image area inside the card (default 60px) */
  height?: number | string;
  products: Product[];
}

// --- Component ---

export const ProductCardGrid: React.FC<ProductCardGridProps> = ({
  width = "240px", // Adjusted default to match image proportions better than 75px
  height = "180px", // Adjusted default to match image proportions better than 60px
  products = [],
}) => {
  // Style object for dynamic dimensions
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
          {/* Image Section */}
          <div className="pc-card__image-container" style={imageStyle}>
            <img
              src={product.image}
              alt={product.productName}
              className="pc-card__img"
            />
          </div>

          {/* Info Section */}
          <div className="pc-card__body">
            <h3 className="pc-card__title">{product.productName}</h3>

            <div className="pc-card__footer">
              <span className="pc-card__price">
                ${product.price.toFixed(2)}
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
