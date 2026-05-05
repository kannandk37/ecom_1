import { useState, useEffect, ReactNode } from "react";
import axiosinstance from "../../service";
import { useNavigate } from "react-router-dom";
import HomeBanner from "../../assets/banner/Banner";
import Banner from "../../../data/Home_Banner.png";
import "./Home.css";
import { CardGrid, CardItem } from "../../assets/card1/Card";
import DRY_FRUITS from "../../../data/DRY_FRUITS.png";
import NUTS from "../../../data/NUTS.png";
import DATES from "../../../data/DATES.png";
import FRESH_JUICE from "../../../data/FRESH_JUICE.png";
import Loader from "../../assets/loader/Loader";
import { CategoryService } from "../../service/category";
import { Category } from "../../entity/category";

export const productsTestData: {
  image: ReactNode;
  name: string;
  price: number;
}[] = [
  { image: DRY_FRUITS, name: "Almond1", price: 10 },
  { image: NUTS, name: "Cashew2", price: 12 },
  { image: DATES, name: "Walnut3", price: 14 },
  { image: DRY_FRUITS, name: "Almond4", price: 10 },
  { image: NUTS, name: "Cashew5", price: 12 },
  { image: DATES, name: "Walnut6", price: 14 },
  { image: DRY_FRUITS, name: "Almond7", price: 10 },
  { image: NUTS, name: "Cashew8", price: 12 },
  { image: DATES, name: "Walnut9", price: 14 },
  { image: DRY_FRUITS, name: "Almond90", price: 10 },
  { image: NUTS, name: "Cashew11", price: 12 },
  { image: DATES, name: "Walnut12", price: 14 },
  { image: DATES, name: "Walnut92", price: 14 },
  { image: DRY_FRUITS, name: "Almond93", price: 10 },
  { image: NUTS, name: "Cashew13", price: 12 },
  { image: DATES, name: "Walnut14", price: 14 },
];

const myCards: CardItem[] = [
  {
    id: " 1",
    image: DRY_FRUITS,
    title: "Dry Fruits",
  },
  {
    id: " 2",
    image: NUTS,
    title: "Nuts",
  },
  {
    id: " 3",
    image: DATES,
    title: "Dates",
  },
  {
    id: " 4",
    image: FRESH_JUICE,
    title: "Fresh Juices",
  },
  {
    id: " 5",
    image: NUTS,
    title: "Chocolates",
  },
  // {
  // id:'6',
  //   image: DATES,
  //   title: "Walnuts",
  // },
  // {
  // id:' 7',
  //   image: DRY_FRUITS,
  //   title: "Walnuts",
  // },
];

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
  const [products, setProducts] = useState<any>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [cardData, setCardData] = useState<CardItem[]>([]);

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  useEffect(() => {
    // fetchProducts();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  // const fetchProducts = async () => {
  //   try {
  //     const res = await axiosinstance.get("/api/products");
  //     setProducts(res.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // const addToCart = async (product: any) => {
  //   if (cart?.order) {
  //     let cartData = {
  //       _id: cart._id,
  //       userId: user._id,
  //       order: {
  //         _id: cart?.order?._id,
  //         products: [...cart?.order?.products, product],
  //       },
  //     };
  //     console.log(cartData, "asda");
  //     let updatedCart = await axiosinstance.put(
  //       `/api/carts/${cartData.userId}/user`,
  //       cartData,
  //     );
  //     if (updatedCart.data) {
  //       navigate("/cart");
  //     }
  //   } else {
  //     let cartData = {
  //       userId: user._id,
  //       order: {
  //         products: [product],
  //       },
  //     };
  //     let persistCart = await axiosinstance.post("/api/carts", cartData);
  //     if (persistCart.data) {
  //       navigate("/cart");
  //     }
  //   }
  // };

  // const emptyUserCart = async () => {
  //   try {
  //     if (user?._id) {
  //       await axiosinstance.delete(`/api/carts/${user._id}/user/empty`);
  //       navigate(0);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  useEffect(() => {
    console.log(products);
  }, [products]);

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
      {loading ? (
        <Loader text="Roasting your results..." />
      ) : (
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
                    cardsPerColumn={cardData?.length / 4}
                    //  height="320px"
                    onCardClick={handleCardClick}
                  />
                  {/* <ProductCard /> */}
                </div>
              </div>
              {/* <OrderItems orders={[{
                id: '#DF-98231',
                status: 'Delivered',
                date: 'Oct 24, 2024',
                totalPrice: '4,225.00',
                address: '42 Lavender Lane, Botanical Gardens, Bangalore, 560004',
                itemThumbnails: [
                  DRY_FRUITS,
                  DATES,
                  NUTS,
                  DRY_FRUITS,
                  DATES
                ],
              },
              {
                id: '#DF-98104',
                status: 'In Process',
                date: 'Oct 22, 2024',
                totalPrice: '1,850.00',
                address: '88 Heritage Street, Fort Area, Mumbai, 400001',
                itemThumbnails: [
                  DRY_FRUITS
                ],
                itemDescription: 'Himalayan Green Tea (250g)',
              },
              {
                id: '#DF-97882',
                status: 'Pending Payment',
                date: 'Oct 15, 2024',
                totalPrice: '5,100.00',
                address: '15 Sunrise Boulevard, IT Park, Pune, 411057',
                itemThumbnails: [
                  DRY_FRUITS,
                  DATES,
                  NUTS,
                  DRY_FRUITS,
                  DATES,
                  DRY_FRUITS,
                  DATES,
                  NUTS,
                  DRY_FRUITS,
                  DATES
                ],
              },]} /> */}
              {/* <ProductImageGallery images={images} height={"650px"} width={"650px"} /> */}
              {/* <ProductCarousel /> */}
              {/* <Carousel
              title="Our Best Sellers"
              data={productsTestData}
              renderItem={(item: any) => <ProductCardGridSingle product={item} />}
              {data.map((item: any, index: any) => (
              <ProductCardGridSingle product={item} />
              ))}
              <Card
                key={index}
                name={item.name}
                price={item.price}
                image={item.image}
              />
              <CardGrid
                cards={myCards}
                cardsPerColumn={1}
                height="320px"
              />
            /> */}
              {/* <ProductCardGrid products={productsTestData} /> */}
              {/* <ReviewCard reviews={mockReviews} /> */}
              {/* <CustomerRievew /> */}
              {/* <Carousel
                title="Our Best Sellers"
                data={productsTestData}
              renderItem={(item: any) => <ProductCardGridSingle product={item} />}
            /> */}
            </div>
          </div>
        </div>
      )}
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
//         <Card image={product.image} name={product.name} price={product.price} />
//       )}
//     />
//   );
// }

// import { useState, useEffect } from "react";
// import axiosinstance from "../../service";
// import { useNavigate } from "react-router-dom";
// import HomeBanner from "../../assets/banner/Banner";
// import Banner from "../../../data/banner.png";
// import "./Home.css";

// import { CardGrid } from "../../assets/card1/Card";
// import DRY_FRUITS from "../../../data/DRY_FRUITS.png";
// import NUTS from "../../../data/NUTS.png";
// import DATES from "../../../data/DATES.png";

// interface CardItem {
//   image: string;
//   title: string;
// }

// const myCards: CardItem[] = [
//   {
//     image: DRY_FRUITS,
//     title: "Dry Fruits",
//   },
//   {
//     image: NUTS,
//     title: "Mixed Nuts",
//   },
//   {
//     image: DATES,
//     title: "Almonds",
//   },
//   {
//     image: DRY_FRUITS,
//     title: "Cashews",
//   },
//   {
//     image: NUTS,
//     title: "Walnuts",
//   },
//   {
//     image: DATES,
//     title: "Walnuts",
//   },
//   {
//     image: DRY_FRUITS,
//     title: "Walnuts",
//   },
// ];

// const Home = () => {
//   const [user, setUser] = useState<any>(null);
//   const [cart, setCart] = useState<any>();
//   const [products, setProducts] = useState<any>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const res = await axiosinstance.get("/api/products");
//       setProducts(res.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const addToCart = async (product: any) => {
//     if (cart?.order) {
//       let cartData = {
//         _id: cart._id,
//         userId: user._id,
//         order: {
//           _id: cart?.order?._id,
//           products: [...cart?.order?.products, product],
//         },
//       };
//       console.log(cartData, "asda");
//       let updatedCart = await axiosinstance.put(
//         `/api/carts/${cartData.userId}/user`,
//         cartData,
//       );
//       if (updatedCart.data) {
//         navigate("/cart");
//       }
//     } else {
//       let cartData = {
//         userId: user._id,
//         order: {
//           products: [product],
//         },
//       };
//       let persistCart = await axiosinstance.post("/api/carts", cartData);
//       if (persistCart.data) {
//         navigate("/cart");
//       }
//     }
//   };

//   const emptyUserCart = async () => {
//     try {
//       if (user?._id) {
//         await axiosinstance.delete(`/api/carts/${user._id}/user/empty`);
//         navigate(0);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     const fetchUserCart = async () => {
//       if (user?._id) {
//         const res = await axiosinstance.get(`/api/carts/${user?._id}/user`);
//         if (res?.data) {
//           setCart(res.data);
//         }
//       }
//     };
//     fetchUserCart();
//   }, [user]);

//   return (
//     <div className="root-home">
//       {/* <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           padding: "10px",
//           borderBottom: "1px solid gray",
//         }}
//       >
//         <h2
//           onClick={() => {
//             navigate(0);
//           }}
//         >
//           Fruit Store
//         </h2>

//         <div style={{ display: "flex", flexDirection: "row", gap: "9px" }}>
//           {user ? (
//             <>
//               <button
//                 style={{
//                   backgroundColor: "#41bec2",
//                   border: "0",
//                   borderRadius: "15px",
//                   width: "90px",
//                   height: "35px",
//                 }}
//                 onClick={() => {
//                   emptyUserCart();
//                 }}
//               >
//                 Empty Cart
//               </button>
//               <button
//                 style={{
//                   backgroundColor: "#41bec2",
//                   border: "0",
//                   borderRadius: "15px",
//                   width: "140px",
//                   height: "35px",
//                 }}
//               >
//                 Total Cart Price (
//                 {cart?.order?.products?.length ? cart?.order?.totalPrice : 0})
//               </button>
//               <text
//                 style={{
//                   backgroundColor: "#41bec2",
//                   border: "0",
//                   borderRadius: "15px",
//                   height: "35px",
//                   alignContent: "center",
//                   textAlign: "center",
//                   padding: "10px 15px",
//                 }}
//                 onClick={() => {
//                   navigate("/profile");
//                 }}
//               >
//                 {user?.name}
//               </text>
//               <button
//                 style={{
//                   backgroundColor: "#41bec2",
//                   border: "0",
//                   borderRadius: "15px",
//                   width: "90px",
//                   height: "35px",
//                 }}
//                 onClick={() => {
//                   navigate("/order");
//                 }}
//               >
//                 Orders
//               </button>
//               <button
//                 style={{
//                   backgroundColor: "#41bec2",
//                   border: "0",
//                   borderRadius: "15px",
//                   width: "90px",
//                   height: "35px",
//                 }}
//                 onClick={() => {
//                   navigate("/cart");
//                 }}
//               >
//                 Cart (
//                 {cart?.order?.products?.length
//                   ? cart?.order?.products?.length
//                   : 0}
//                 )
//               </button>
//               <button
//                 style={{
//                   backgroundColor: "#41bec2",
//                   border: "0",
//                   borderRadius: "15px",
//                   width: "90px",
//                   height: "35px",
//                 }}
//                 onClick={() => {
//                   localStorage.removeItem("user");
//                   navigate(0);
//                 }}
//               >
//                 Sign out
//               </button>
//             </>
//           ) : (
//             <button
//               style={{
//                 backgroundColor: "#41bec2",
//                 border: "0",
//                 borderRadius: "15px",
//                 width: "90px",
//                 height: "35px",
//               }}
//               onClick={() => {
//                 navigate("/login");
//               }}
//             >
//               Sign In
//             </button>
//           )}
//         </div>
//       </div> */}
//       <HomeBanner
//         image={Banner}
//         fontSize2="22px"
//         buttonText="Shop Now"
//         buttonVariant="primary"
//         onButtonClick={() => console.log("asda")}
//       />
//       <text className="catrgory-title">Categories</text>
//       <CardGrid cards={myCards} cardsPerColumn={1} />

//       {/* <div style={{ padding: "20px" }}>
//         {products.map((product: any) => (
//           <div
//             key={product._id}
//             style={{
//               border: "0",
//               borderRadius: "15px",
//               backgroundColor: "#fd9d75",
//               marginBottom: "10px",
//               padding: "10px",
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <div
//               style={{ display: "flex", gap: "9px", flexDirection: "column" }}
//             >
//               <h3>{product.name}</h3>
//               <p>Price: ₹{product.price}</p>
//             </div>
//             <div>
//               <button
//                 style={{
//                   backgroundColor: "#96e3a5",
//                   border: "0",
//                   borderRadius: "15px",
//                   width: "90px",
//                   height: "35px",
//                 }}
//                 onClick={() => {
//                   if (user) {
//                     addToCart(product);
//                   } else {
//                     navigate("/login");
//                   }
//                 }}
//               >
//                 Add to Cart
//               </button>
//             </div>
//           </div>
//         ))}
//       </div> */}
//     </div>
//   );
// };

// export default Home;
