import React, {
  type ReactNode,
  type ButtonHTMLAttributes,
  useMemo,
} from "react";
import "./IconButton.css";

export type IconButtonVariant = "primary" | "secondary" | "outline";
export type IconButtonSize = "small" | "medium" | "large";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  size?: IconButtonSize;
  width?: string | number;
  height?: string | number;
  variant?: IconButtonVariant;
  onclick?: () => void;
  badge?: number;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = "medium",
  width,
  height,
  variant = "primary",
  disabled = false,
  className = "",
  style,
  onClick,
  badge,
  ...rest
}) => {
  const finalDimensions = useMemo(() => {
    if (width || height) {
      const dimension = width || height;
      return {
        width: typeof dimension === "number" ? `${dimension}px` : dimension,
        height: typeof dimension === "number" ? `${dimension}px` : dimension,
      };
    }
    return {};
  }, [width, height]);

  const combinedStyles: React.CSSProperties = {
    ...finalDimensions,
    ...style,
  };

  const classNames = [
    "icon-button",
    `icon-button--${variant}`,
    `icon-button--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const showBadge = badge !== undefined && badge > 0;

  return (
    <span className="icon-button__wrapper">
      <button
        className={classNames}
        style={combinedStyles}
        disabled={disabled}
        type={rest.type || "button"}
        aria-label={rest["aria-label"] || "icon button"}
        {...rest}
        onClick={onClick}
      >
        <span className="icon-button__content">{icon}</span>
      </button>

      {showBadge && (
        <span className="icon-button__badge" aria-label={`${badge} items`}>
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </span>
  );
};

export default IconButton;