import { useState, useEffect, ReactNode } from "react";
import axiosinstance from "../../../service";
import { useNavigate } from "react-router-dom";
import HomeBanner from "../../../assets/banner/Banner";
import Banner from "../../../../data/Home_Banner.png";
import "./Home.css";
import { CardGrid, CardItem } from "../../../assets/card1/Card";
import DRY_FRUITS from "../../../../data/DRY_FRUITS.png";
import { CategoryService } from "../../../service/category";
import { Category } from "../../../entity/category";
import Toast from "../../../assets/toast/Toast";

// const mockReviews: any[] = [
//   {
//     id: 1,
//     name: "Sarah M.",
//     comment: "Excellent quality! Fresh and crunchy almonds.",
//     rating: 5,
//     isVerified: true,
//   },
//   {
//     id: 2,
//     name: "James L.",
//     comment:
//       "Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.Pretty good, but some pieces were smaller than expected.",
//     rating: 3.5,
//     isVerified: true,
//   },
//   {
//     id: 3,
//     name: "Anonymous",
//     comment: "The packaging was great, arrived on time.",
//     rating: 4,
//     isVerified: false,
//   },
// ];

// const images = [DRY_FRUITS, NUTS, DATES, DRY_FRUITS, NUTS, DATES];
const Home = () => {
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<any>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [cardData, setCardData] = useState<CardItem[]>([]);
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        let categories = await new CategoryService().get();
        setCardData(
          categories?.map((category: Category) => {
            return {
              id: category.id,
              image: DRY_FRUITS,
              title: category.name,
            } as CardItem;
          }),
        );
      } catch (error) {
        setShowError(true);
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchUserCart = async () => {
      if (user?._id) {
        const res = await axiosinstance.get(`/api/carts/${user?._id}/user`);
        if (res?.data) {
          setCart(res.data);
        }
      }
    };
    fetchUserCart();
  }, [user]);

  const handleCardClick = (category: any) => {
    navigate(`/categories/${category.id}/products`, {
      state: { category: category },
    });
  };

  const handleScrollDown = () => {
    const scrollContainer =
      document.querySelector(".scroll-viewport") || window;

    scrollContainer.scrollBy({
      top: 400,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {showError && (
        <Toast
          title="Category"
          description="Unable to Get Categories"
          isError={false}
          duration={5000}
          onClose={() => setShowError(false)}
        />
      )}
      <div className="root-home">
        <div className="scroll-viewport">
          <div className="home-container">
            <HomeBanner
              image={Banner}
              width="100%"
              height="400px"
              borderRadius="20px"
              fontSize2="22px"
              buttonText="Shop Now"
              buttonVariant="primary"
              onButtonClick={handleScrollDown}
              showButton={true}
              showTitle1={true}
              showTitle2={true}
              title1="PREMIUM QUALITY, NATURALLY DELICIOUS"
              title2="Discover our curated collection of dry fruits, nuts, dates, and healthy snacks."
            />
            <div className="categoreis-container">
              <h2 className="categories-title">Categories</h2>
              <div className="categories-cards-container">
                <CardGrid
                  cards={cardData}
                  cardsPerColumn={4}
                  onCardClick={handleCardClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

// import { useState } from "react"

// interface CardProps {
//   image: string;
//   name: string;
//   price: number;
// }

// const Card = ({ image, name, price }: CardProps) => {
//   return (
//     <div className="card">
//       <img src={image} />
//       <h4>{name}</h4>
//       <p>${price}</p>
//     </div>
//   );
// };

// interface CarouselProps<T> {
//   items: T[];
//   renderItem: (item: T, index: number) => React.ReactNode;
// }

// function Carousel<T>({ items, renderItem }: CarouselProps<T>) {
//   const [index, setIndex] = useState(0);

//   const next = () => {
//     setIndex((prev) => Math.min(prev + 1, items.length - 1));
//   };

//   const prev = () => {
//     setIndex((prev) => Math.max(prev - 1, 0));
//   };

//   return (
//     <div className="carousel">
//       <button onClick={prev}>◀</button>

//       <div className="carousel-track">
//         {items.map((item, i) => (
//           <div key={i} className="carousel-item">
//             {renderItem(item, i)}
//           </div>
//         ))}
//       </div>

//       <button onClick={next}>▶</button>
//     </div>
//   );
// }

// const products = [
//   { image: DRY_FRUITS, name: "Almond", price: 10 },
//   { image: NUTS, name: "Cashew", price: 12 },
//   { image: DATES, name: "Walnut", price: 14 },
//   { image: DRY_FRUITS, name: "Almond", price: 10 },
//   { image: NUTS, name: "Cashew", price: 12 },
//   { image: DATES, name: "Walnut", price: 14 },
// ];

// function ProductCarousel() {
//   return (
//     <Carousel
//       items={products}
//       renderItem={(product) => (
//         <Card image={product.image} name={product.name} price={product?.variants[0]?.price} />
//       )}
//     />
//   );
// }
