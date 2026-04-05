import React, { type ReactNode } from "react";
import "./Button.css";

export type ButtonVariant = "primary" | "secondary" | "outline";

export interface ButtonProps {
  name?: string;
  icon?: ReactNode;
  width?: string | number;
  height?: string | number;
  variant?: ButtonVariant;
  disabled: boolean;
  fontSize?: string;
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  name,
  icon,
  width,
  height,
  variant = "primary",
  disabled = false,
  fontSize,
  onClick,
}) => {
  // Combine dynamic styles for width/height with the CSS classes
  const customStyles = {
    width: width || "auto",
    height: height || "auto",
    fontSize: fontSize || "13px",
  };

  return (
    <button
      className={`ds-button ds-button--${variant}`}
      style={customStyles}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {icon && <span className="ds-button__icon">{icon}</span>}
      <span className="ds-button__text">{name}</span>
    </button>
  );
};

export default Button;
