import React, { type ReactNode } from "react";
import "./StatisticCard.css";

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  trendValue?: string; // e.g., "+12%"
  trendBgColor?: string;
  trendColor?: string;
  showBackground?: boolean;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  icon,
  iconBgColor = "#dcf0d2", // Default light green
  iconColor = "#4b633d", // Default dark green
  trendValue,
  trendBgColor = "#dcf0d2",
  trendColor = "#4b633d",
  showBackground = true,
  width = "320px",
  height = "auto",
  className = "",
}) => {
  const cardStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    backgroundColor: showBackground ? "#ffffff" : "transparent",
    boxShadow: showBackground ? "0 10px 30px rgba(0, 0, 0, 0.04)" : "none",
  } as React.CSSProperties;

  return (
    <div className={`stat-card ${className}`} style={cardStyle}>
      <div className="stat-card__top">
        {icon && (
          <div
            className="stat-card__icon-wrapper"
            style={{ backgroundColor: iconBgColor, color: iconColor }}
          >
            {icon}
          </div>
        )}

        {trendValue && (
          <div
            className="stat-card__trend-chip"
            style={{ backgroundColor: trendBgColor, color: trendColor }}
          >
            {trendValue}
          </div>
        )}
      </div>

      <div className="stat-card__content">
        <span className="stat-card__title">{title.toUpperCase()}</span>
        <h2 className="stat-card__value">{value}</h2>
      </div>
    </div>
  );
};

export default StatisticCard;
