import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Banner from "../../../data/Banner dry fruits.png";
import HomeBanner from "../../assets/banner/Banner";
import ProductCard from "../../assets/card2/ProductCard";
import "./categoryProducts.css";
import Dropdown from "../../assets/dropdown/DropDown";
import { ProductService } from "../../service/product";
import { Product } from "../../entity/product";
import { LocalStorage } from "../../storage";
import LogInOrSignUp from "../../assets/dialogue/LogInOrSignUp";
import { WishListService } from "../../service/wishlist";
import { Wishlist } from "../../entity/wishlist";
import { Variant } from "../../entity/variant";
import { useWishlist } from "../../context/wishlist";
import axios from "axios";
import Loader2 from "../../assets/loader/Loader2";
import Toast from "../../assets/toast/Toast";
import { CategoryService } from "../../service/category";
import { Category } from "../../entity/category";

const sortOptions: { id: number; value: string }[] = [
  { id: 1, value: "Popularity" },
  { id: 2, value: "Price: Low to High" },
  { id: 3, value: "Price: High to Low" },
  { id: 4, value: "Newest Arrivals" },
];

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { addToWishlist, removeFromWishlist } = useWishlist();
  const [toast, setToast] = useState<string>();

  useEffect(() => {
    (async () => {
      if (categoryId) {
        setIsLoading(true);
        try {
          const categoryDatum = await new CategoryService().getById(categoryId);
          setCategory(categoryDatum);
        } catch (error: any) {
          console.log(error);
          if (axios.isAxiosError(error) && error.response?.data?.statusCode) {
            setToast(error.response?.data?.error);
          }
        } finally {
          setIsLoading(false);
        }

        setIsLoading(true);
        try {
          const productsData = await new ProductService().getByCategoryId(categoryId);
          let productsWithVariant = productsData?.length > 0 ? productsData?.filter((product: Product) => product.variants?.length > 0) : [];
          setProducts(productsWithVariant);
        } catch (error: any) {
          console.log(error);
          if (axios.isAxiosError(error) && error.response?.data?.statusCode) {
            setToast(error.response?.data?.error);
          }
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [categoryId]);

  const handleCardClick = (product: any) => {
    navigate(`/products/${product.id}`, { state: { product } });
  };

  const onClickAddToCart = async (product: any) => {
    const userData = await new LocalStorage().getUser();
    if (!userData) {
      setAuthModalOpen(true);
    } else {
      setAuthModalOpen(false);
      navigate(`/cart`);
    }
  };

  const handleToggleFav = async (
    clickedProduct: Product,
    clickedVariant: Variant,
    clickedWishlist: Wishlist,
  ) => {
    const userData = await new LocalStorage().getUser();
    if (!userData) {
      setAuthModalOpen(true);
    } else {
      try {
        const response = await new WishListService().toggle(
          userData.id,
          clickedProduct.id,
          clickedVariant?.id,
        );
        if (response) {
          if (response.id) {
            addToWishlist(response);
          } else {
            removeFromWishlist(clickedWishlist.id);
          }
        }
      } catch (error: any) {
        console.error("Failed to update wishlist", error);
        if (axios.isAxiosError(error) && error.response?.data?.statusCode) {
          setToast(error.response?.data?.error);
        }
      }
    }
  };

  if (isLoading) return <Loader2 />;

  return (
    <>
      {toast && (
        <Toast
          title="Unable To Fetch Product"
          description={toast}
          isError={true}
          duration={5000}
          onClose={() => setToast(null)}
        />
      )}

      <div className="category-products-home">
        <div className="category-products-scroll-viewport">
          <div className="category-products-container">
            <HomeBanner
              image={Banner}
              width="100%"
              height="400px"
              borderRadius="20px"
            />
            <div className="category-products-content">
              <div className="category-products-top-bar">
                <nav className="category-products-breadcrumbs">
                  <span onClick={() => navigate("/")}>Category</span>
                  <span>&gt;</span>
                  <span className="category-products-active-crumb">
                    {category?.name}
                  </span>
                </nav>
                <Dropdown label="Popularity" options={sortOptions} />
              </div>
              {products?.length > 0 ? (
                <ProductCard
                  products={products}
                  onClick={handleCardClick}
                  onClickAddToCart={onClickAddToCart}
                  onToggleFav={handleToggleFav}
                />
              ) : (
                <span className="category-products-empty">
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