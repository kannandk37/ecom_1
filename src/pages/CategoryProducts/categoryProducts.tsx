import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Banner from "../../../data/Banner dry fruits.png";
import HomeBanner from "../../assets/banner/Banner";
import ProductCard from "../../assets/card2/ProductCard";
import NUTS from "../../../data/NUTS.png";
import DRY_FRUITS from "../../../data/DRY_FRUITS.png";
import "./categoryProducts.css";
import Dropdown from "../../assets/dropdown/DropDown";
import { ProductService } from "../../service/product";
import { Product, Unit } from "../../entity/product";
import { LocalStorage } from "../../storage";
import LogInOrSignUp from "../../assets/dialogue/LogInOrSignUp";

export const productsData: Product[] = [
  {
    id: "1",
    title: "Premium California Almonds",
    description: "Crunchy and nutritious, perfect for snacking.",
    images: [NUTS],
    price: 750,
    weight: "501",
    unit: Unit.G,
    // isFav: false,
    category: { id: "1" },
    // quantity: 2,
  },
  // {
  //   id: "2",
  //   title: "Premium California Almonds",
  //   description: "Crunchy and nutritious, perfect for snacking.",
  //   images: [NUTS],
  //   price: 750,
  //   weight: "500",
  //   unit: Unit.G,
  //   isFav: true,
  //   categoryId: 1,
  //   quantity: 2,
  // },
  // {
  //   id: "3",
  //   title: "Premium California Almonds",
  //   description: "Crunchy and nutritious, perfect for snacking.",
  //   images: [NUTS],
  //   price: 750,
  //   weight: "500",
  //   unit: Unit.G,
  //   isFav: true,
  //   categoryId: 1,
  //   quantity: 2,
  // },
  // {
  //   id: "4",
  //   title: "Premium California Almonds",
  //   description: "Crunchy and nutritious, perfect for snacking.",
  //   images: [NUTS],
  //   price: 750,
  //   weight: "500",
  //   unit: Unit.G,
  //   isFav: true,
  //   categoryId: 1,
  //   quantity: 2,
  // },
  // {
  //   id: "5",
  //   title: "Premium California Almonds",
  //   description: "Crunchy and nutritious, perfect for snacking.",
  //   images: [NUTS],
  //   price: 750,
  //   weight: "500",
  //   unit: Unit.G,
  //   isFav: true,
  //   categoryId: 1,
  //   quantity: 2,
  // },
  // {
  //   id: "6",
  //   images: [NUTS],
  //   categoryId: 2,
  //   title: "Premium California Almonds",
  //   description:
  //     "These Premium California almonds are carefully selected for their superior taste, crunch, and nutritional value. Packed with protien, fiber and healthy fats, they make a prefect snack for a healthy lifestyle. Our almonds sourced and packed to maintain freshness",
  //   price: 750,
  //   weight: "500",
  //   unit: Unit.G,
  //   isFav: true,
  //   name: "Premium California Almonds",
  //   images: [DRY_FRUITS, NUTS],
  //   quantity: 2,
  //   rating: 3.5,
  //   reviews: 4,
  //   features: ["tester1", "tester2"],
  //   specs: [
  //     { label: "Origin", value: "California, USA" },
  //     { label: "Shelf Life", value: "12 months" },
  //     { label: "Storage", value: "Cool and dry place" },
  //   ],
  // },
  // {
  //   id: "7",
  //   title: "Premium California Almonds",
  //   description: "Crunchy and nutritious, perfect for snacking.",
  //   images: [NUTS],
  //   price: 750,
  //   weight: "500",
  //   unit: Unit.G,
  //   isFav: true,
  //   categoryId: 2,
  //   quantity: 2,
  // },
  //   {
  //   id: "sdf",
  //   name: "adfa",
  //   price: "12",
  //   rating: 2,
  //   reviews: 12,
  //   weight: "12",
  //   description: "sdfsd",
  //   features: [],
  //   specs: [{ label: "asd", value: "asd" }],
  //   images: ["asd", "fgdf"],
  // }
];

const sortOptions: { id: number; value: string }[] = [
  { id: 1, value: "Popularity" },
  { id: 2, value: "Price: Low to High" },
  { id: 3, value: "Price: High to Low" },
  { id: 4, value: "Newest Arrivals" },
];

let mockCategory = {
  id: 1,
  image: DRY_FRUITS,
  title: "Dry Fruits",
};

const CategoryProducts = ({ }) => {
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [category, setCategory] = useState<any>(mockCategory);

  const [products, setProducts] = useState<Product[]>([]);
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (categoryId) {
        setIsLoading(true);
        try {
          let productsData = await new ProductService().getByCategoryId(
            categoryId,
          );
          setProducts(productsData);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [categoryId]);

  const fetchProductsOfCategory = async (id: string) => {
    console.log(id);
    // setProducts()
  };

  const fetchCategory = async (id: string) => {
    console.log(id);
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
      // setProducts(productsData.filter((el) => el?.categoryId == category?.id));
    }
  }, [categoryId]);

  const handleCardClick = (product: any) => {
    navigate(`/products/${product.id}`, { state: { product: product } });
  };

  const onClickAddToCart = (product: any) => {
    navigate(`/cart`, { state: { product: product } });
  };

  const handleToggleFav = async (clickedProduct: Product) => {
    // 1. OPTIMISTIC UPDATE: Update the local state immediately
    // setProducts((prevProducts) =>
    //   prevProducts.map((p) =>
    //     p.id === clickedProduct.id ? { ...p, isFav: !p.isFav } : p,
    //   ),
    // );
    let userData = await new LocalStorage().getUser();

    if (!userData) {
      setAuthModalOpen(true);
    } else {
      try {
        // 2. BACKGROUND API CALL
        // await api.toggleWishlist(clickedProduct.id);
        console.log("Wishlist updated successfully");
      } catch (error) {
        // 3. ROLLBACK: If the API fails, flip it back and alert user
        console.error("Failed to update wishlist", error);
        // setProducts((prevProducts) =>
        //   prevProducts.map((p) =>
        //     p.id === clickedProduct.id
        //       ? { ...p, isFav: clickedProduct.isFav }
        //       : p,
        //   ),
        // );
        alert("Could not update wishlist. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="category-products-home">
        <div className="scroll-viewport">
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
                <nav className="category-product-breadcrumbs">
                  <span onClick={() => navigate("/")}>Category</span>
                  <span>&gt; </span>
                  <span className="category-product-active-crumb">
                    {category?.title}
                  </span>
                </nav>
                <Dropdown label="Popularity" options={sortOptions} />
              </div>
              {products?.length > 0 ? (
                // <div className="products-lists">
                <ProductCard
                  products={products}
                  onClick={handleCardClick}
                  onClickAddToCart={onClickAddToCart}
                  onToggleFav={handleToggleFav}
                />
              ) : (
                // </div>
                <span
                  style={{
                    height: "100vh",
                    marginLeft: "30vw",
                    fontSize: "28px",
                  }}
                >
                  No Products Available For This Category Right Now
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <LogInOrSignUp
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export default CategoryProducts;
