import React from "react";
import "./ReviewCard.css";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaCheckCircle,
} from "react-icons/fa";

// --- Interfaces ---

export interface Review {
  id: string | number;
  name: string;
  comment: string;
  rating: number;
  isVerified: boolean;
}

export interface ReviewCardProps {
  width?: string | number;
  height?: string | number;
  reviews: Review[];
}

// --- Helper Component: StarRating ---

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className="star-icon full" />);
    } else if (i - 0.5 <= rating) {
      stars.push(<FaStarHalfAlt key={i} className="star-icon half" />);
    } else {
      stars.push(<FaRegStar key={i} className="star-icon empty" />);
    }
  }
  return <div className="review-card__stars">{stars}</div>;
};

// --- Main Component ---

export const ReviewCard: React.FC<ReviewCardProps> = ({
  width = "100%",
  height = "auto",
  reviews = [],
}) => {
  const containerStyle: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div className="review-list-container" style={containerStyle}>
      {reviews.map((review) => (
        <div key={review.id} className="review-card">
          <div className="review-card__header">
            <div className="review-card__user-info">
              <span className="review-card__name">{review.name}</span>

              {/* Conditional rendering with reserved space */}
              <div
                className={`review-card__verified ${!review.isVerified ? "hidden" : ""}`}
              >
                <FaCheckCircle className="verified-icon" />
                <span style={{ fontFamily: "var(--font-family)" }}>
                  Verified Purchase
                </span>
              </div>
            </div>

            <StarRating rating={review.rating} />
          </div>

          <p className="review-card__comment">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewCard;
