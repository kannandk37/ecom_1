// import React, { useState, useEffect } from "react";
// import "./ProductImageGallery.css";

// interface ProductImageGalleryProps {
//   images: string[];
//   width?: number | string;
//   height?: number | string;
// }

// const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
//   images = [],
//   width = 400,
//   height = 450,
// }) => {
//   const [selectedIndex, setSelectedIndex] = useState(0);

//   useEffect(() => {
//     setSelectedIndex(0);
//   }, [images]);

//   const isEmpty = images.length === 0;

//   const displayImages = isEmpty ? Array(5).fill(null) : images;

//   const containerStyle = {
//     width,
//     height,
//   };

//   return (
//     <div className="product-gallery" style={containerStyle}>
//       {/* Main Image */}
//       <div className="main-image">
//         {isEmpty ? (
//           <div className="placeholder big">X</div>
//         ) : (
//           <img src={images[selectedIndex]} alt="selected product" />
//         )}
//       </div>

//       {/* Thumbnails */}
//       <div className="thumbnail-row">
//         {displayImages.map((img, index) => (
//           <div
//             key={index}
//             className={`thumbnail ${
//               index === selectedIndex && !isEmpty ? "active" : ""
//             }`}
//             onClick={() => !isEmpty && setSelectedIndex(index)}
//           >
//             {img ? (
//               <img src={img} alt={`thumb-${index}`} />
//             ) : (
//               <div className="placeholder small">X</div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductImageGallery;

import React, { useState, useMemo, type ReactNode } from "react";
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

  // Handle empty state
  const hasImages = images.length > 0;
  const currentImage = hasImages ? images[selectedIndex] : null;

  // Compute dynamic wrapper style for scaling
  const containerStyle: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div className="pg-wrapper" style={containerStyle}>
      {/* Main Display Area */}
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

      {/* Thumbnail Row */}
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
          : // Render 5 placeholder thumbnails if empty
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="pg-placeholder pg-placeholder--thumb">
                <span>X</span>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
