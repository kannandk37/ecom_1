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
//               <span className="pd-price">₹{product.variants[0].price.toFixed(2)}</span>
//               <span className="pd-weight">{product.variants[0].weight} {product.variants[0].unit} pack</span>
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
import { FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import ProductImageGallery from "../../assets/ProductImageGallery/ProductImageGallery";
import Button from "../../assets/button/Button";
import CustomerRievew from "../CustomerReview/CustomerRievew";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { StarRating } from "../../assets/review/Review";
import { useNavigate, useParams } from "react-router-dom";
import { Label, Product, SpecValue } from "../../entity/product";
import { ProductService } from "../../service/product";
import NUTS from "../../../data/NUTS.png";
import LogInOrSignUp from "../../assets/dialogue/LogInOrSignUp";
import { LocalStorage } from "../../storage";
import { CartItem } from "../../entity/cart_item";
import Loader2 from "../../assets/loader/Loader2";
import { useCart } from "../../context/cart";
import { Variant } from "../../entity/variant";
import Chip from "../../assets/ui/Chip/Chip";
import ProductCardGrid from "../../assets/productCardGrid/ProductCardGrid";
import { capitalize } from "../../utils/utils";

export const ProductDetails = ({ }) => {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState<number>(1);
  const [product, setProduct] = useState<Product>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const {
    cart,
    isHydrated,
    cartError,
    clearCartError,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyPromocode,
    removePromocode,
    clearCart,
    setCart,
    totalItems,
    totalPrice,
  } = useCart();

  const [variants, setVariants] = useState<Variant[]>([]);
  const [selecteVariant, setSelectedVariant] = useState<Variant>();

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (productId) {
        setIsLoading(true);
        try {
          let productsData = await new ProductService().get();
          if (productsData?.length > 0) {
            const productsOptionsData = productsData.filter((product: Product) => product.id !== productId);
            setProducts(productsOptionsData);
          } else {
            setProducts([]);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [productId]);

  useEffect(() => {
    (async () => {
      if (productId) {
        setIsLoading(true);
        try {
          const productDatum = await new ProductService().getById(productId);
          setProduct(productDatum);
          setVariants(productDatum.variants);
          setSelectedVariant(productDatum?.variants[0]);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [productId]);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const user = await new LocalStorage().getUser();
      if (user?.id) {
        const cartItem = new CartItem();
        cartItem.product = product;
        cartItem.variant = selecteVariant;
        cartItem.quantity = 1;
        await addToCart(cartItem);
        navigate("/cart");
      } else {
        setIsLoading(false);
        setAuthModalOpen(true);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader2 />
      ) : (
        <>
          {product && (
            <div className="product-page-root">
              <div className="product-scroll-viewport">
                <div className="product-page">

                  <div className="product-main-section">
                    <ProductImageGallery
                      images={
                        selecteVariant
                          ? selecteVariant.images
                          : product?.images?.length > 0
                            ? product?.images
                            : [NUTS]
                      }
                    />

                    <div className="product-info">
                      <nav className="product-breadcrumbs">
                        <span onClick={() => navigate("/")}>Home</span>
                        <span>{">"}</span>
                        <span onClick={() => navigate(-1)}>{capitalize(product?.category?.name)}</span>
                        <span>{">"}</span>
                        <span className="product-breadcrumbs-active">{capitalize(product?.name)}</span>
                      </nav>

                      <h1 className="product-title">{capitalize(selecteVariant?.name)}</h1>

                      <div className="product-rating-row">
                        <div className="product-stars">
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
                        <span className="product-rating-text">
                          {product.averageRating} ({""} Reviews)
                        </span>
                      </div>

                      <div className="product-price-row">
                        <span className="product-price">₹ {selecteVariant?.price}</span>
                        <span className="product-weight-tag">
                          {selecteVariant?.weight}
                          {selecteVariant?.unit} pack
                        </span>
                      </div>

                      <ul className="product-feature-list">
                        {product?.features?.map((feature: any, i: number) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>

                      {variants?.length > 0 && (
                        <div className="product-variants-section">
                          <h3 className="product-variants-title">Select Weight</h3>
                          <div className="product-variants-row">
                            {variants.map((variant, i) => (
                              <Chip
                                key={variant.id ?? i}
                                icon={<FaHeart />}
                                title={`${variant.weight}${variant.unit}`}
                                value={`₹${variant.price}`}
                                variant={selecteVariant?.id === variant.id ? "primary" : "outline"}
                                onClick={() => setSelectedVariant(variant)}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="product-purchase-actions">
                        <h2 className="product-quantity-label">Quantity:</h2>
                        <div className="product-quantity-selector">
                          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
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
                          variant="secondary"
                          disabled={false}
                          onClick={() => {
                            setProduct(product);
                            setAuthModalOpen(true);
                          }}
                        />
                      </div>

                      <div className="product-description-section">
                        <h3>Product Description</h3>
                        <p>{product.description}</p>
                      </div>

                      <div className="product-specs-grid">
                        {product?.specs?.map((spec: SpecValue, i: number) => (
                          <div key={i} className="product-spec-card">
                            <span className="product-spec-label">{spec.label} — </span>
                            <span className="product-spec-value">
                              {spec.label === Label.SHELF_LIFE
                                ? `${spec.value?.quantity} ${spec.value?.unit?.charAt(0).toLocaleUpperCase() + spec.value?.unit?.slice(1)}`
                                : spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="product-related-section">
                    <h2 className="product-section-title">You May Also Like</h2>
                    <ProductCardGrid products={products} />
                  </div>

                  <div className="product-related-section">
                    <h2 className="product-section-title">Customer Review</h2>
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
      )}
    </>
  );
};
export default ProductDetails;
