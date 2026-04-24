import React, { type ReactNode } from "react";
import "./DashBoardButton.css";

export type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps {
  name?: string;
  icon?: ReactNode;
  width?: string | number;
  height?: string | number;
  variant?: ButtonVariant;
  disabled?: boolean;
  fontSize?: string;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
  showBg?: boolean;
  side?: string;
}

export const DashboardButton: React.FC<ButtonProps> = ({
  name = "Login",
  icon,
  width = "100%",
  height = "auto",
  variant = "primary",
  disabled = false,
  fontSize = "1.05rem",
  onClick,
  type = "button",
  showBg = true,
  side,
}) => {
  const buttonStyle: React.CSSProperties = {
    "--btn-width": typeof width === "number" ? `${width}px` : width,
    "--btn-height": typeof height === "number" ? `${height}px` : height,
    "--btn-font-size": fontSize,
    // "--btn-justify-content": side,
  } as React.CSSProperties;

  return (
    <button
      type={type}
      className={showBg ? `dashboard-btn dashboard-btn--${variant}` : ""}
      style={{ ...buttonStyle, justifyContent: side ? "flex-start" : "center" }}
      disabled={disabled}
      onClick={(e) => {
        if (type !== "submit") e.preventDefault();
        onClick();
      }}
    >
      <span className="dashboard-btn__content">
        {icon && <span className="dashboard-btn__icon">{icon}</span>}
        {name}
      </span>
    </button>
  );
};

export default DashboardButton;
