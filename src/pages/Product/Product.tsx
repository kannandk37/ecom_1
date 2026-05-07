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

import React, { useEffect, useState } from "react";
import "./Product.css";
import { FiMinus, FiPlus, FiHeart, FiShoppingCart } from "react-icons/fi";
import ProductImageGallery from "../../assets/ProductImageGallery/ProductImageGallery";
import ProductCardGrid from "../../assets/productCardGrid/ProductCardGrid";
import Button from "../../assets/button/Button";
import CustomerRievew from "../CustomerReview/CustomerRievew";
import { productsData } from "../CategoryProducts/categoryProducts";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { StarRating } from "../../assets/review/Review";
import { useNavigate, useParams } from "react-router-dom";
import { Label, Product, SpecValue } from "../../entity/product";
import { ProductService } from "../../service/product";
import NUTS from '../../../data/NUTS.png';
import LogInOrSignUp from "../../assets/dialogue/LogInOrSignUp";
import { LocalStorage } from "../../storage";
import { Cart } from "../../entity/cart";
import { CartItem } from "../../entity/cart_items";
import { CartService } from "../../service/cart";
import Loader2 from '../../assets/loader/Loader2';

interface ProductProps {
  productData?: Product;
}

export const ProductDetails: React.FC<ProductProps> = ({ productData }) => {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState<number>(1);
  const [product, setProduct] = useState<Product>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (productId) {
        setIsLoading(true);
        try {
          let productDatum = await new ProductService().getById(productId);
          setProduct(productDatum);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    })()
  }, [productId]);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      let user = await new LocalStorage().getUser();
      if (user?.id) {
        let cart = new Cart();
        let cartItem = new CartItem();
        cartItem.product = product;
        //TODO: have to add for variant;
        cartItem.variant = null;
        cartItem.quantity = quantity;
        cart.cartItems = [cartItem];
        await new CartService().create(cart);
        navigate('/cart');
      } else {
        setAuthModalOpen(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {
        isLoading ? (
          <Loader2 />
        ) : (
          <>
            {product && (
              <div className="product-page-root">
                <div className="product-scroll-viewport">
                  <div className="product-page">
                    <div className="product-main-section">
                      <ProductImageGallery images={product?.images?.length > 0 ? product?.images : [NUTS]} />

                      <div className="product-info">
                        <div className="breadcrumbs">
                          <h2>Home</h2>
                          <h2>{">"}</h2>
                          <h2>{product?.category?.name}</h2>
                          <h2>{">"}</h2>
                          <h2>{product?.name}</h2>
                        </div>
                        <h1 className="product-title">{product.name}</h1>

                        <div className="rating-row">
                          <div className="stars">
                            {/* {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        fill={
                          i < Math.floor(product?.rating || 0)
                            ? "#8c6d3f"
                            : "none"
                        }
                        color="#8c6d3f"
                      /> 
                    ))}*/}
                            <StarRating rating={product?.averageRating || 0} />
                          </div>
                          <span className="rating-text">
                            {product.averageRating} ({
                              // product.reviews ??  // TODO: need to work on this 
                              ''} Reviews)
                          </span>
                        </div>

                        <div className="price-row">
                          <span className="price">₹ {product.price}</span>
                          <span className="weight-tag">
                            {product.weight}
                            {product.unit} pack
                          </span>
                        </div>

                        <ul className="feature-list">
                          {product?.features?.map((feature: any, i: number) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>

                        <div className="purchase-actions">
                          <h2 style={{ fontWidth: "bold" }}>Quantity:</h2>
                          <div className="quantity-selector">
                            <button
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                              <FiMinus />
                            </button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>
                              <FiPlus />
                            </button>
                          </div>
                          <Button
                            name="Add to Cart"
                            icon={<FiShoppingCart />}
                            variant="primary"
                            disabled={false}
                            onClick={handleAddToCart}
                          />
                          <Button
                            name="Add to Wishlist"
                            icon={product ? <FaRegHeart /> : <FaHeart />}
                            variant={"secondary"}
                            disabled={false}
                            onClick={() => {
                              // product.isFav = !product.isFav;
                              setProduct(product);
                              console.log("Added to wishlist", product);
                              // TODO: if no user
                              setAuthModalOpen(true);
                              // TODO: user logged in
                              // call api to add or delete to wishlist
                            }}
                          />
                        </div>

                        <div className="description-section">
                          <h3>Product Description</h3>
                          <p>{product.description}</p>
                        </div>

                        <div className="specs-grid">
                          {product?.specs?.map((spec: SpecValue, i: number) => (
                            <div key={i} className="spec-card">
                              <span className="spec-label">{spec.label} — </span>
                              <span className="spec-value">{spec.label == Label.SHELF_LIFE ? `${spec.value?.quantity} ${spec.value?.unit?.charAt(0).toLocaleUpperCase() + spec.value?.unit?.slice(1)}` : spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="related-section">
                      <h2 className="section-title">You May Also Like</h2>
                      {/* Using your existing component */}
                      <ProductCardGrid products={productsData as any} />
                    </div>
                    <div className="related-section">
                      <h2 className="section-title">Customer Review</h2>
                      <CustomerRievew />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <LogInOrSignUp
              isOpen={isAuthModalOpen}
              onClose={() => setAuthModalOpen(false)}
            />
          </>
        )
      }
    </>
  );
};

export default ProductDetails;
