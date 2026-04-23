import { useRef, type ReactNode } from "react";
import "./Carousel.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IconButton } from "../icon_button/IconButton"; // Assuming your previous IconButton

interface CarouselProps<T> {
  title?: string;
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
}

export function Carousel<T>({ title, data, renderItem }: CarouselProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="carousel-root">
      {title && <h2 className="carousel-title">{title}</h2>}

      <div className="carousel-main">
        <div className="nav-wrapper nav-wrapper--left">
          <IconButton
            icon={<FiChevronLeft />}
            onClick={() => handleScroll("left")}
            variant="primary"
            size="medium"
          />
        </div>

        <div className="carousel-viewport" ref={scrollRef}>
          {data.map((item, index) => (
            <div key={index} className="carousel-item">
              {renderItem(item, index)}
            </div>
          ))}
        </div>

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
