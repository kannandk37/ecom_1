import React, { useState, useEffect } from "react";
import "./LeaderboardBar.css";
import { FiMoreHorizontal } from "react-icons/fi";
import { colors } from "@/src/utils/utils";

// Define the shape of each item's data
interface LeaderboardItem {
  name: string;
  pic: string; // URL to the avatar
  price: string | number; // e.g., "₹12,400 Spent"
  orderCount: number; // For the tooltip
  percentage: number; // Bar width (0-100)
}

interface LeaderboardCardProps {
  title: string;
  data: LeaderboardItem[];
  showMoreOptions?: boolean;
  onMoreOptionsClick?: () => void;
  width?: string | number;
  height?: string | number;
  className?: string;
  maxBars?: number; // Provision for future growth
  customColors?: string[];
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  title,
  data = [],
  showMoreOptions = true,
  onMoreOptionsClick,
  width = "100%", // Default fills container
  height = "auto",
  className = "",
  maxBars = 5, // Currently fixed at 5 for design fidelity
  customColors,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const visibleData = data.slice(0, maxBars);

  // Trigger animation on initial mount
  useEffect(() => {
    // Small delay ensures the browser registers the 0% initial width
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const containerStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  } as React.CSSProperties;

  return (
    <div className={`lbrd-card ${className}`} style={containerStyle}>
      {/* HEADER SECTION */}
      <div className="lbrd-header">
        <h3 className="lbrd-title">{title}</h3>
        {showMoreOptions && (
          <button
            type="button"
            className="lbrd-more-btn"
            onClick={onMoreOptionsClick}
            aria-label="More Options"
          >
            <FiMoreHorizontal />
          </button>
        )}
      </div>

      {/* DATA & BARS LIST */}
      <div className="lbrd-list">
        {visibleData.map((item, index) => {
          const barColor = customColors
            ? customColors[index % customColors.length]
            : colors[index % colors.length];
          // Animation Logic: start from 0 if not loaded
          const animatedWidth = isLoaded ? `${item.percentage}%` : "0%";

          // Tooltip content: combines percentage and order count
          const tooltipText = `Orders: ${item.orderCount.toLocaleString()} (${item.percentage}%)`;

          return (
            <div key={`${item.name}-${index}`} className="lbrd-row">
              {/* Left: Avatar (Reference uses full pic, not just icon) */}
              <div className="lbrd-avatar-wrapper">
                <img src={item.pic} alt={item.name} className="lbrd-avatar" />
              </div>

              {/* Middle: Name & Value/Price */}
              <div className="lbrd-info">
                <span className="lbrd-item-name">{item.name}</span>
                <span className="lbrd-item-value">{item.price}</span>
              </div>

              {/* Right: The Progress Bar Track */}
              <div className="lbrd-track-container">
                <div className="lbrd-track">
                  <div
                    className="lbrd-fill has-tooltip"
                    style={{
                      width: animatedWidth,
                      backgroundColor: barColor,
                    }}
                    data-tooltip={tooltipText} // Tooltip logic
                    role="progressbar"
                    aria-valuenow={item.percentage}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderboardCard;
