import React from "react";
import { FiClipboard } from "react-icons/fi";
import './StockInfoCard.css';

interface StockInfoCardProps {
  label: React.ReactNode;
  value: string;
  icon?: React.ReactNode;
}

const StockInfoCard: React.FC<StockInfoCardProps> = ({
  label,
  value,
  icon = <FiClipboard />,
}) => {
  return (
    <div className="stock-info-card">
      <div className="stock-info-card-icon">{icon}</div>
      <div className="stock-info-card-text">
        <span className="stock-info-card-label">{label}</span>
        <span className="stock-info-card-value">{value}</span>
      </div>
    </div>
  );
};

export default StockInfoCard;