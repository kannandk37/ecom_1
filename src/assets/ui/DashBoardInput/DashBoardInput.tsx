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
}) => {
  return (
    <div
      className={`db-input-group ${error ? "db-input--error" : ""}`}
      style={style}
    >
      {label && <label className="db-label">{label.toUpperCase()}</label>}

      <div className="db-input-wrapper">
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
              className={`db-field ${icon ? "icon" : ""}`}
              style={{ resize: "none" }}
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
              className={`db-field ${icon ? "icon" : ""}`}
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

// import React, { forwardRef, useRef, type ReactNode } from "react";
// import "./DashBoardInput.css";

// interface DashboardInputProps {
//   label?: string;
//   type?: string;
//   placeholder?: string;
//   value: string;
//   onChange: (value: string) => void;
//   required?: boolean;
//   disabled?: boolean;
//   error?: boolean;
//   errorMessage?: string;
//   icon?: ReactNode;
//   name?: string;
//   style?: React.CSSProperties;
//   row?: number;
//   ref?: any;
// }

// export const DashboardInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, DashboardInputProps>(({
//   label,
//   type = "text",
//   placeholder,
//   value,
//   onChange,
//   required = false,
//   disabled = false,
//   error = false,
//   errorMessage,
//   icon,
//   name,
//   style,
//   row = 5 }, ref) => {

//   return (
//     <div
//       className={`db-input-group ${error ? "db-input--error" : ""}`}
//       style={style}
//     >
//       {label && <label className="db-label">{label.toUpperCase()}</label>}

//       <div className="db-input-wrapper">
//         {icon && <span className="db-icon">{icon}</span>}
//         {type == "textarea" ? (
//           <>
//             <textarea
//               name={name}
//               placeholder="Enter a brief description"
//               value={value}
//               rows={row}
//               onChange={(e) => onChange(e.target.value)}
//               required={required}
//               disabled={disabled}
//               className={`db-field ${icon ? 'icon' : ''}`}
//               style={{ resize: "none" }}
//               ref={ref as React.Ref<HTMLTextAreaElement>}
//             />
//           </>
//         ) : (
//           <>
//             <input
//               name={name}
//               type={type}
//               placeholder={placeholder}
//               value={value}
//               onChange={(e) => onChange(e.target.value)}
//               required={required}
//               disabled={disabled}
//               className={`db-field ${icon ? 'icon' : ''}`}
//               ref={ref as React.Ref<HTMLInputElement>}
//             />
//           </>
//         )}
//       </div>

//       {error && errorMessage && (
//         <span className="db-error-message">{errorMessage}</span>
//       )}
//     </div>
//   );
// });

// export default DashboardInput;
