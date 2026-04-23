import React, { useEffect, useState } from "react";
import "./PerformanceBar.css";
import { FiMoreHorizontal } from "react-icons/fi";
import { colors } from "../../../utils/utils";

interface ProductPerformance {
  name: string;
  count: number;
  percentage: number;
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
  maxBars?: number;
  customColors?: string[];
}

export const PerformanceBar: React.FC<PerformanceBarProps> = ({
  title,
  data = [],
  showMoreOptions = true,
  showTooltip = true,
  onMoreOptionsClick,
  width = "100%",
  height = "auto",
  className = "",
  maxBars = 5,
  customColors,
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const visibleData = data.slice(0, maxBars);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const containerStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  } as React.CSSProperties;

  return (
    <div className={`p-bar-card ${className}`} style={containerStyle}>
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

      <div className="p-bar-list">
        {visibleData.map((item, index) => {
          const barColor = customColors
            ? customColors[index % customColors.length]
            : colors[index % colors.length];
          const animatedWidth = isLoaded ? `${item.percentage}%` : "0%";

          return (
            <div key={`${item.name}-${index}`} className="p-bar-item">
              <div className="p-bar-info">
                <span className="p-bar-product-name">{item.name}</span>
                <span className="p-bar-percentage-label">
                  {item.percentage}%
                </span>
              </div>

              <div className="p-bar-track">
                <div
                  className={`p-bar-fill ${showTooltip ? "has-tooltip" : ""}`}
                  style={{
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
