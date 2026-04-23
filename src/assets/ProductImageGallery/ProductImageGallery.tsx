import React, { useState } from "react";
import "./ProductImageGallery.css";

interface ProductImageGalleryProps {
  images: string[];
  width?: number | string;
  height?: number | string;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images = [],
  width = "100%",
  height = "auto",
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const hasImages = images.length > 0;
  const currentImage = hasImages ? images[selectedIndex] : null;

  const containerStyle: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div className="pg-wrapper" style={containerStyle}>
      <div className="pg-main-display">
        {hasImages ? (
          <img
            src={currentImage!}
            alt="Selected product"
            className="pg-main-image"
          />
        ) : (
          <div className="pg-placeholder pg-placeholder--main">
            <span>X</span>
          </div>
        )}
      </div>
      <div
        className={`pg-thumbnail-container ${images.length > 5 ? "pg-thumbnail-container--scroll" : ""}`}
      >
        {hasImages
          ? images.map((url, index) => (
              <button
                key={`${url}-${index}`}
                className={`pg-thumb-btn ${index === selectedIndex ? "pg-thumb-btn--active" : ""}`}
                onClick={() => setSelectedIndex(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={url}
                  alt={`Thumbnail ${index + 1}`}
                  className="pg-thumb-img"
                />
              </button>
            ))
          : Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="pg-placeholder pg-placeholder--thumb">
                <span>X</span>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
