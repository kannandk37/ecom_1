import React, { ReactNode } from 'react';
import './Chip.css';

export interface ChipProps {
  title: string;
  value?: string | number;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  width?: string;
  height?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Chip: React.FC<ChipProps> = ({
  title,
  value,
  icon,
  variant = 'primary',
  width,
  height,
  style,
  onClick,
}) => {
  const customStyles = {
    width,
    height,
    ...style,
  };

  return (
    <button
      className={`organic-chip organic-chip-${variant}`}
      style={customStyles}
      onClick={onClick}
      type="button"
    >
      <span className="organic-chip-left">
        {icon && <span className="organic-chip-icon">{icon}</span>}
        <span className="organic-chip-title">{title}</span>
      </span>
      
      {value !== undefined && value !== null && (
        <span className="organic-chip-badge">{value}</span>
      )}
    </button>
  );
};

export default Chip;