import React, { useMemo } from "react";
import "./Review.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export interface Review {
  id: string | number;
  name: string;
  rating: number;
  isVerified: boolean;
  attributes?: string[];
}

export interface ReviewSummaryProps {
  reviews: Review[];
  width?: number | string;
  height?: number | string;
}

export const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<FaStar key={i} className="rs-star rs-star--full" />);
    } else if (i - 0.5 <= rating) {
      stars.push(<FaStarHalfAlt key={i} className="rs-star rs-star--half" />);
    } else {
      stars.push(<FaRegStar key={i} className="rs-star rs-star--empty" />);
    }
  }
  return <div className="rs-stars-wrapper">{stars}</div>;
};

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  reviews,
  width = "100%",
  height = "auto",
}) => {
  const metrics = useMemo(() => {
    if (reviews.length) {
      const totalReviews = reviews.length;
      if (totalReviews === 0) return { average: 0, total: 0, distribution: [] };

      const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
      const average = parseFloat((sum / totalReviews).toFixed(1));

      const counts = [0, 0, 0, 0, 0]; // Index 0 = 1 star, Index 4 = 5 star
      reviews.forEach((r) => {
        const floored = Math.floor(r.rating);
        const index = Math.max(1, Math.min(5, floored)) - 1;
        counts[index]++;
      });

      const distribution = counts.reverse().map((count, idx) => ({
        label: 5 - idx,
        count,
        percentage: (count / totalReviews) * 100,
      }));

      return { average, total: totalReviews, distribution };
    }
  }, [reviews]);

  const containerStyle: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };
  console.log(metrics);
  return (
    <div className="rs-container" style={containerStyle}>
      <h2 className="rs-title">Customer Reviews</h2>

      <div className="rs-header">
        <span className="rs-average-num">{metrics?.average || 0}</span>
        <div className="rs-header-stars">
          <StarRating rating={metrics?.average || 0} />
          <span className="rs-total-count">{metrics?.total || 0} Reviews</span>
        </div>
      </div>

      <div className="rs-distribution">
        {metrics?.distribution.map((bar) => (
          <div key={bar.label} className="rs-bar-row">
            <span className="rs-bar-label">{bar.label}★</span>
            <div className="rs-progress-bg">
              <div
                className="rs-progress-fill"
                style={{ width: `${bar.percentage}%` }}
              />
            </div>
            <span className="rs-bar-percent">
              {Math.round(bar.percentage)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSummary;
