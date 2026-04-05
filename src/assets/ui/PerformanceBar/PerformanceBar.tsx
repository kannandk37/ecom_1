import React, { useEffect, useState, type ReactNode } from "react";
import "./PerformanceBar.css";
import { FiMoreHorizontal } from "react-icons/fi"; // npm install react-icons
import { colors } from "@/src/utils/utils";

// Interface for each product data point
interface ProductPerformance {
  name: string;
  count: number;
  percentage: number; // Value between 0 and 100
}

interface PerformanceBarProps {
  title: string;
  data: ProductPerformance[];
  showMoreOptions?: boolean;
  showTooltip?: boolean;
  onMoreOptionsClick?: () => void;
  width?: string | number;
  height?: string | number;
  className?: string;
  maxBars?: number; // Built-in flexibility: limit how many are shown
  customColors?: string[];
}

export const PerformanceBar: React.FC<PerformanceBarProps> = ({
  title,
  data = [],
  showMoreOptions = true,
  showTooltip = true,
  onMoreOptionsClick,
  width = "100%", // Container fills available width
  height = "auto",
  className = "",
  maxBars = 5, // Currently showing up to 5
  customColors,
}) => {
  // Logic: Ensure we only show up to maxBars to maintain design
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const visibleData = data.slice(0, maxBars);

  // Trigger animation after the component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Dynamic Sizing Prop Handling
  const containerStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  } as React.CSSProperties;

  return (
    <div className={`p-bar-card ${className}`} style={containerStyle}>
      {/* HEADER SECTION */}
      <div className="p-bar-header">
        <h3 className="p-bar-title">{title}</h3>
        {showMoreOptions && (
          <button
            type="button"
            className="p-bar-more-btn"
            onClick={onMoreOptionsClick}
            aria-label="More Options"
          >
            <FiMoreHorizontal />
          </button>
        )}
      </div>

      {/* DATA & BARS SECTION */}
      <div className="p-bar-list">
        {visibleData.map((item, index) => {
          // Progressive color assignment
          const barColor = customColors
            ? customColors[index % customColors.length]
            : colors[index % colors.length];
          const barWidth = `${item.percentage}%`;
          // ANIMATION LOGIC:
          // If not loaded, width is 0. If loaded, width is the actual percentage.
          const animatedWidth = isLoaded ? `${item.percentage}%` : "0%";

          return (
            <div key={`${item.name}-${index}`} className="p-bar-item">
              {/* Product Info (Left Text, Right Percentage) */}
              <div className="p-bar-info">
                <span className="p-bar-product-name">{item.name}</span>
                <span className="p-bar-percentage-label">
                  {item.percentage}%
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="p-bar-track">
                {/* Colored Progress Fill */}
                <div
                  className={`p-bar-fill ${showTooltip ? "has-tooltip" : ""}`}
                  style={{
                    // width: barWidth,
                    width: animatedWidth,
                    backgroundColor: barColor,
                  }}
                  data-tooltip={`Count: ${item.count.toLocaleString()}`}
                  role="progressbar"
                  aria-valuenow={item.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceBar;
