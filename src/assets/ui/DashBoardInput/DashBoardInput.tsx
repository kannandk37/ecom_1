import React, { type ReactNode } from "react";
import "./DashBoardInput.css";
interface DashboardInputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  icon?: ReactNode;
  name?: string;
  style?: React.CSSProperties;
  row?: number;
  onClickIcon?: () => void;
  showBorder?: boolean;
}

export const DashboardInput: React.FC<DashboardInputProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error = false,
  errorMessage,
  icon,
  name,
  style,
  row = 5,
  onClickIcon,
  showBorder = false,
}) => {
  return (
    <div
      className={`db-input-group ${error ? "db-input--error" : ""}`}
      style={style}
    >
      {label && <label className="db-label">{label.toUpperCase()}</label>}

      <div
        className="db-input-wrapper"
      >
        {icon && (
          <span
            className="db-icon"
            style={{ pointerEvents: onClickIcon ? "auto" : "none" }}
            onClick={onClickIcon}
          >
            {icon}
          </span>
        )}
        {type == "textarea" ? (
          <>
            <textarea
              name={name}
              placeholder="Enter a brief description"
              value={value}
              rows={row}
              onChange={(e) => onChange(e.target.value)}
              required={required}
              disabled={disabled}
              className={`db-field ${icon ? "icon" : ""} ${showBorder ? 'border' : ''}`}
            />
          </>
        ) : (
          <>
            <input
              name={name}
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              required={required}
              disabled={disabled}
              className={`db-field ${icon ? "icon" : ""} ${showBorder ? 'border' : ''}`}
            />
          </>
        )}
      </div>

      {error && errorMessage && (
        <span className="db-error-message">{errorMessage}</span>
      )}
    </div>
  );
};

export default DashboardInput;