import React from "react";
import { createPortal } from "react-dom";
import "./Loader2.css";

interface LoaderProps {
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = "Loading" }) => {
  const loaderMarkup = (
    <div className="loader2-overlay">
      <div className="loader2-content">
        <div className="loader2-orbit-container">
          <div className="loader2-orbit-track" />
          <div className="loader2-leaf-wrapper">
            <div className="loader2-circling-icon">🍃</div>
          </div>
          <div className="loader2-center-icon">🌿</div>
        </div>
        <p className="loader2-text">
          {text}
          <span className="loader2-dot">.</span>
          <span className="loader2-dot">.</span>
          <span className="loader2-dot">.</span>
        </p>
      </div>
    </div>
  );

  return createPortal(loaderMarkup, document.body);
};

export default Loader;