import React, { useState } from "react";
import "./ReviewList.css";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaCheckCircle,
} from "react-icons/fa";

export interface Review {
  id: string | number;
  name: string;
  comment: string;
  rating: number;
  isVerified: boolean;
}

interface ReviewListProps {
  reviews: Review[];
  initialVisible?: number;
  incrementBy?: number;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<FaStar key={i} className="rl-star full" />);
    } else if (i - 0.5 <= rating) {
      stars.push(<FaStarHalfAlt key={i} className="rl-star half" />);
    } else {
      stars.push(<FaRegStar key={i} className="rl-star empty" />);
    }
  }
  return <div className="rl-stars-wrapper">{stars}</div>;
};

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews = [],
  initialVisible = 5,
  incrementBy = 5,
}) => {
  const [visibleCount, setVisibleCount] = useState(initialVisible);

  const showMoreReviews = () => {
    setVisibleCount((prevCount) => prevCount + incrementBy);
  };

  const hasMoreReviews = reviews.length > visibleCount;

  return (
    <div className="rl-container">
      <div className="rl-card-list">
        {reviews.slice(0, visibleCount).map((review) => (
          <div key={review.id} className="rl-card">
            <div className="rl-card__header">
              <div className="rl-card__user-info">
                <span className="rl-card__name">{review.name}</span>
                {review.isVerified && (
                  <div className="rl-card__verified">
                    <FaCheckCircle className="verified-icon" />
                    <span>Verified Purchase</span>
                  </div>
                )}
              </div>
              <StarRating rating={review.rating} />
            </div>
            <p className="rl-card__comment">{review.comment}</p>
          </div>
        ))}
      </div>

      {hasMoreReviews && (
        <button className="rl-show-more-btn" onClick={showMoreReviews}>
          Show More
        </button>
      )}
    </div>
  );
};

export default ReviewList;
