// import React, { useState, useEffect, useMemo } from 'react';
// import { useParams, useLocation, Link } from 'react-router-dom';
// import './ProductDetail.css';

// // --- External Component Imports (as specified) ---
// import ProductImageGallery from './ProductImageGallery'; // Separate component
// import ProductRecommendations from './ProductRecommendations'; // Separate component
// import { ReviewList, Review } from './ReviewList'; // Optimized reusable component
// import QuantitySelector from './QuantitySelector'; // Optimized reusable component
// import IconButton from '../icon_button/IconButton'; // Separate component

// // Reusable SVG Icons (Cart/Wishlist)
// import { FiShoppingCart, FiHeart, FiChevronRight } from 'react-icons/fi';
// import { FaStar } from 'react-icons/fa';

// // --- Full Product Interface ---
// export interface Product {
//   id: string | number;
//   title: string;
//   price: number;
//   weight: number;
//   unit: string;
//   description: string;
//   origin: string;
//   shelfLife: string;
//   storage: string;
//   isFav?: boolean;
//   images: string[];
//   thumbnails: string[];
//   reviews: Review[];
// }

// // --- Component ---

// export const ProductDetail: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const location = useLocation();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [quantity, setQuantity] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);

//   // Data Fetching Orchestration
//   useEffect(() => {
//     window.scrollTo(0, 0); // Scroll to top on load

//     // 1. Check if product data was passed via location state (Optimistic UI)
//     if (location.state?.product) {
//       setProduct(location.state.product);
//       setIsLoading(false);
//     } else {
//       // 2. Fetch from API if no state is present (Fallback)
//       // fetchProductData(id).then(data => { setProduct(data); setIsLoading(false); });
//       console.log(`Fetching data for product ID: ${id}`);

//       // MOCK DATA for demonstration (based on image)
//       setTimeout(() => {
//         setProduct({
//           id: id || 1,
//           title: "Premium California Almonds",
//           price: 18.99,
//           weight: 500,
//           unit: "g",
//           description: "These premium California almonds are carefully selected for their superior taste, crunch, and nutritional value. Packed with protein, fiber, and healthy fats, they make a perfect snack for a healthy lifestyle. Our almonds are naturally sourced and packed to maintain freshness and quality.",
//           origin: "California, USA",
//           shelfLife: "12 months",
//           storage: "Cool and dry place",
//           isFav: false,
//           images: [ /* URLs */ ],
//           thumbnails: [ /* URLs */ ],
//           reviews: [ /* MOCK REVIEW ARRAY */ ]
//         });
//         setIsLoading(false);
//       }, 1000);
//     }
//   }, [id, location.state]);

//   // SINGLE PASS Calculation for overall rating
//   const averageRating = useMemo(() => {
//     if (!product?.reviews?.length) return 0;
//     const totalReviews = product.reviews.length;
//     const sum = product.reviews.reduce((acc, curr) => acc + curr.rating, 0);
//     return parseFloat((sum / totalReviews).toFixed(1));
//   }, [product?.reviews]);

//   if (isLoading) {
//     return <div className="pd-loading">Loading Product Details...</div>;
//   }

//   if (!product) {
//     return <div className="pd-error">Product not found.</div>;
//   }

//   return (
//     <div className="pd-page">
//       {/* 1. THEMED SCROLLBAR APPLIED TO ENTIRE PAGE */}

//       {/* 2. Page Container (Centralized Content) */}
//       <div className="pd-container">
//         {/* Breadcrumbs (Matching Image) */}
//         <nav className="pd-breadcrumbs">
//           <Link to="/">Home</Link> <FiChevronRight />
//           <Link to="/nuts">Nuts</Link> <FiChevronRight />
//           <Link to="/nuts/almonds">Almonds</Link> <FiChevronRight />
//           <span className="current">{product.title}</span>
//         </nav>

//         {/* --- MAIN PRODUCT SECTION --- */}
//         <div className="pd-main-section">
//           {/* Left: Reusable Image Gallery */}
//           <div className="pd-media">
//             <ProductImageGallery
//               images={product.images}
//               thumbnails={product.thumbnails}
//             />
//           </div>

//           {/* Right: Informational Section */}
//           <div className="pd-info">
//             <h1 className="pd-title">{product.title}</h1>

//             {/* Overall Rating Section */}
//             <div className="pd-rating-summary">
//               <div className="pd-rating__stars">
//                 {/* Full stars for average rating */}
//                 {[...Array(5)].map((_, i) => (
//                   <FaStar key={i} className={`star-icon ${i < Math.floor(averageRating) ? 'full' : 'empty'}`} />
//                 ))}
//               </div>
//               <span className="pd-rating__num">{averageRating}</span>
//               <span className="pd-rating__count">({product.reviews.length} Reviews)</span>
//             </div>

//             {/* Price & Weight Section */}
//             <div className="pd-price-weight-row">
//               <span className="pd-price">₹{product.price.toFixed(2)}</span>
//               <span className="pd-weight">{product.weight} {product.unit} pack</span>
//             </div>

//             {/* Attributes List */}
//             <ul className="pd-attributes">
//               <li>Premium quality almonds</li>
//               <li>Naturally sourced</li>
//               <li>No preservatives</li>
//             </ul>

//             {/* --- ACTION SECTION --- */}
//             <div className="pd-actions">
//               <div className="pd-actions__quantity">
//                 <span className="pd-label">Quantity:</span>
//                 <QuantitySelector quantity={quantity} onChange={setQuantity} />
//               </div>

//               <div className="pd-actions__buttons">
//                 {/* Reusable Icon Button (Add to Cart) */}
//                 <IconButton
//                   icon={<FiShoppingCart />}
//                   text="Add to Cart"
//                   variant="primary"
//                   size="large"
//                 />

//                 {/* Reusable Icon Button (Add to Wishlist) */}
//                 <IconButton
//                   icon={<FiHeart />}
//                   text="Add to Wishlist"
//                   variant="outline"
//                   size="large"
//                 />
//               </div>
//             </div>

//             {/* --- PRODUCT DESCRIPTION SECTION --- */}
//             <div className="pd-description">
//               <h3 className="pd-section-title">Product Description</h3>
//               <p>{product.description}</p>

//               <div className="pd-spec-grid">
//                 <div className="pd-spec-item"><span className="pd-label">Origin — </span> {product.origin}</div>
//                 <div className="pd-spec-item"><span className="pd-label">Shelf Life — </span> {product.shelfLife}</div>
//                 <div className="pd-spec-item"><span className="pd-label">Storage — </span> {product.storage}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* --- CUSTOMER REVIEWS SECTION --- */}
//         <div className="pd-reviews-section">
//           <h2 className="pd-section-title">Customer Reviews</h2>
//           {/* Optimized Reusable Review List Component */}
//           <ReviewList reviews={product.reviews} initialVisible={5} incrementBy={5} />
//         </div>

//         {/* --- RECOMMENDATIONS SECTION --- */}
//         <div className="pd-recommendations-section">
//           <h2 className="pd-section-title">You May Also Like</h2>
//           {/* Reusable Recommendation Carousel Component */}
//           {/* <ProductRecommendations categoryId={product?.categoryId} currentProductId={product.id} /> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;
