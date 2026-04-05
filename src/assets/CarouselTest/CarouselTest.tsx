// import React, { useRef } from "react";
// import "./CarouselTest.css";
// import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
// import IconButton from "../icon_button/IconButton";

// interface CarouselProps {
//   children: React.ReactNode;
//   title?: string;
// }

// export const Carousel: React.FC<CarouselProps> = ({ children, title }) => {
//   const scrollRef = useRef<HTMLDivElement>(null);

//   const scroll = (direction: "left" | "right") => {
//     if (scrollRef.current) {
//       const { scrollLeft, clientWidth } = scrollRef.current;
//       const scrollTo =
//         direction === "left"
//           ? scrollLeft - clientWidth
//           : scrollLeft + clientWidth;

//       scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
//     }
//   };

//   return (
//     <div className="carousel-root">
//       {title && <h2 className="carousel-title">{title}</h2>}

//       <div className="carousel-controls">
//         {/* <button className="nav-btn prev" onClick={() => scroll("left")}> */}
//         <IconButton
//           icon={<FiChevronLeft />}
//           size="small"
//           variant="primary"
//           onClick={() => scroll("left")}
//         />
//         {/* <FiChevronLeft /> */}
//         {/* </button> */}
//         <div className="carousel-viewport" ref={scrollRef}>
//           {children}
//         </div>
//         <IconButton
//           icon={<FiChevronRight />}
//           size="small"
//           variant="primary"
//           onClick={() => scroll("left")}
//         />
//         {/* <button className="nav-btn next" onClick={() => scroll("right")}>
//           <FiChevronRight />
//         </button> */}
//       </div>
//     </div>
//   );
// };

import React, { useRef, type ReactNode } from "react";
import "./CarouselTest.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IconButton } from "../icon_button/IconButton"; // Assuming your previous IconButton

interface CarouselProps<T> {
  title?: string;
  data: T[];
  /** The component to render for each item */
  renderItem: (item: T, index: number) => ReactNode;
}

export function Carousel<T>({ title, data, renderItem }: CarouselProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // Scroll by one full viewport width
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    //     <div className="carousel-wrapper">
    //       <div className="carousel-header">
    //         {title && <h2 className="carousel-title">{title}</h2>}
    //         <div className="carousel-nav">
    //           <IconButton
    //             icon={<FiChevronLeft />}
    //             onClick={() => handleScroll("left")}
    //             variant="outline"
    //             size="small"
    //           />
    //           <IconButton
    //             icon={<FiChevronRight />}
    //             onClick={() => handleScroll("right")}
    //             variant="outline"
    //             size="small"
    //           />
    //         </div>
    //       </div>

    //       <div className="carousel-viewport" ref={scrollRef}>
    //         {data.map((item, index) => (
    //           <div key={index} className="carousel-item">
    //             {renderItem(item, index)}
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   );
    // }

    <div className="carousel-root">
      {title && <h2 className="carousel-title">{title}</h2>}

      <div className="carousel-main">
        {/* Left Button */}
        <div className="nav-wrapper nav-wrapper--left">
          <IconButton
            icon={<FiChevronLeft />}
            onClick={() => handleScroll("left")}
            variant="primary"
            size="medium"
          />
        </div>

        {/* Viewport */}
        <div className="carousel-viewport" ref={scrollRef}>
          {data.map((item, index) => (
            <div key={index} className="carousel-item">
              {renderItem(item, index)}
            </div>
          ))}
        </div>

        {/* Right Button */}
        <div className="nav-wrapper nav-wrapper--right">
          <IconButton
            icon={<FiChevronRight />}
            onClick={() => handleScroll("right")}
            variant="primary"
            size="medium"
          />
        </div>
      </div>
    </div>
  );
}
