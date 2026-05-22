import { ReactNode } from "react";
import DashBoardButton from "../ui/DashBoardButton/DashBoardButton";
import './SimpleModal.css';

interface SimpleModelProps {
  title: string;
  button1Name: string;
  button1OnClick: () => void;
  button2Name: string;
  button2OnClick: () => void;
  isWarning: boolean;
  icon?: ReactNode;
  subtitle?: string;
  onOverlayClick?: () => void;
}

const SimpleModal: React.FC<SimpleModelProps> = ({
  title,
  button1Name,
  button1OnClick,
  button2Name,
  button2OnClick,
  icon,
  subtitle,
  isWarning,
  onOverlayClick,
}) => {
  return (
    <div
      className="simple-model-overlay"
      onClick={onOverlayClick}
    >
      <div
        className="simple-model-container"
        onClick={(e) => e.stopPropagation()}
      >
        {icon && (
          <div className="simple-model-icon-wrapper" style={{ color: isWarning ? '#4a5a3a' : '#e93535' }}>
            {icon}
          </div>
        )}
        <h2 className="simple-model-title">{title}</h2>
        {subtitle && <p className="simple-model-subtitle">{subtitle}</p>}
        <div className="simple-model-actions">
          <div className="simple-model-btn-wrapper">
            <DashBoardButton name={button1Name} variant="secondary" onClick={button1OnClick} />
          </div>
          <div className="simple-model-btn-wrapper">
            <DashBoardButton name={button2Name} variant="primary" onClick={button2OnClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleModal;