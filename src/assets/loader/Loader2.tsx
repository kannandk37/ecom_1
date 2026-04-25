import React from "react";
import { FaLeaf } from "react-icons/fa";
import "./Loader.css";

interface LoaderProps {
  text?: string; // Optional text, defaults to "Loading..."
}

const Loader: React.FC<LoaderProps> = ({ text = "Curating..." }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-content">
        {/* The Orbital Ring Container */}
        <div className="loader-orbit-container">
          {/* The Orbit Track (Optional aesthetic) */}
          <div className="loader-orbit-track"></div>

          {/* The Circling Leaf */}
          <div className="loader-leaf-wrapper">
            <FaLeaf className="loader-circling-leaf" />
          </div>
        </div>

        <p className="loader-text">{text}</p>
      </div>
    </div>
  );
};

export default Loader;
