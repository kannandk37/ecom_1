import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Banner from "../../../data/banner.png";
import HomeBanner from "../../assets/banner/Banner";
import ProductCard, { type Product } from "../../assets/card2/ProductCard";
import image2 from "../../../data/image2.png";
import image1 from "../../../data/image1.png";
import "./categoryProducts.css";
import Dropdown from "../../assets/dropdown/DropDown";

const productsData: Product[] = [
  {
    id: 1,
    title: "Premium California Almonds",
    description: "Crunchy and nutritious, perfect for snacking.",
    image: image2,
    price: 750,
    weight: 501,
    unit: "g",
    isFav: false,
    categoryId: 1,
  },
  {
    id: 2,
    title: "Premium California Almonds",
    description: "Crunchy and nutritious, perfect for snacking.",
    image: image2,
    price: 750,
    weight: 500,
    unit: "g",
    isFav: true,
    categoryId: 1,
  },
  {
    id: 3,
    title: "Premium California Almonds",
    description: "Crunchy and nutritious, perfect for snacking.",
    image: image2,
    price: 750,
    weight: 500,
    unit: "g",
    isFav: true,
    categoryId: 1,
  },
  {
    id: 4,
    title: "Premium California Almonds",
    description: "Crunchy and nutritious, perfect for snacking.",
    image: image2,
    price: 750,
    weight: 500,
    unit: "g",
    isFav: true,
    categoryId: 1,
  },
  {
    id: 5,
    title: "Premium California Almonds",
    description: "Crunchy and nutritious, perfect for snacking.",
    image: image2,
    price: 750,
    weight: 500,
    unit: "g",
    isFav: true,
    categoryId: 1,
  },
  {
    id: 6,
    title: "Premium California Almonds",
    description: "Crunchy and nutritious, perfect for snacking.",
    image: image2,
    price: 750,
    weight: 500,
    unit: "g",
    isFav: true,
    categoryId: 2,
  },
  {
    id: 7,
    title: "Premium California Almonds",
    description: "Crunchy and nutritious, perfect for snacking.",
    image: image2,
    price: 750,
    weight: 500,
    unit: "g",
    isFav: true,
    categoryId: 2,
  },
];

const sortOptions: { id: number; value: string }[] = [
  { id: 1, value: "Popularity" },
  { id: 2, value: "Price: Low to High" },
  { id: 3, value: "Price: High to Low" },
  { id: 4, value: "Newest Arrivals" },
];

let mockCategory = {
  id: 1,
  image: image1,
  title: "Dry Fruits",
};
const CategoryProducts = ({}) => {
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [category, setCategory] = useState<any>(mockCategory);

  const [products, setProducts] = useState<Product[]>([]);

  const fetchProductsOfCategory = async (id: string) => {
    // setProducts()
  };

  const fetchCategory = async (id: string) => {
    // setCategory()
  };

  useEffect(() => {
    if (!location?.state?.category?.id && categoryId) {
      fetchCategory(categoryId);
    }
  }, [location, categoryId]);

  useEffect(() => {
    setCategory(location.state?.category);
    if (categoryId) {
      fetchProductsOfCategory(categoryId);
      setProducts(productsData.filter((el) => el?.categoryId == category?.id));
    }
  }, [categoryId]);

  const handleCardClick = (product: any) => {
    console.log("product", product);
    navigate(`/products/${product.id}`, { state: { product: product } });
  };

  const onClickAddToCart = (product: any) => {
    navigate(`/cart`, { state: { product: product } });
  };

  const handleToggleFav = async (clickedProduct: Product) => {
    // 1. OPTIMISTIC UPDATE: Update the local state immediately
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === clickedProduct.id ? { ...p, isFav: !p.isFav } : p,
      ),
    );

    try {
      // 2. BACKGROUND API CALL
      // await api.toggleWishlist(clickedProduct.id);
      console.log("Wishlist updated successfully");
    } catch (error) {
      // 3. ROLLBACK: If the API fails, flip it back and alert user
      console.error("Failed to update wishlist", error);
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === clickedProduct.id
            ? { ...p, isFav: clickedProduct.isFav }
            : p,
        ),
      );
      alert("Could not update wishlist. Please try again.");
    }
  };

  return (
    <div className="category-products-home">
      <div className="category-products-contaiiner">
        <HomeBanner
          image={Banner}
          width="100%"
          height="400px"
          borderRadius="20px"
        />
        <div className="products-contaiiner">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingBottom: "25px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <h2 className="hh" onClick={() => navigate("/")}>
                Category
              </h2>
              <h2 className="category-title-symbol">&nbsp;&gt;&nbsp;</h2>
              {category && (
                <h2 className="category-title">{category?.title}</h2>
              )}
            </div>
            <Dropdown label="Popularity" options={sortOptions} />
          </div>
          {products && (
            <div className="products-lists">
              <ProductCard
                products={products}
                onClick={handleCardClick}
                onClickAddToCart={onClickAddToCart}
                onToggleFav={handleToggleFav}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;
