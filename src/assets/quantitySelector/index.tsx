import React from "react";
import "./QuantitySelector.css";
import { FiMinus, FiPlus } from "react-icons/fi";

interface QuantitySelectorProps {
  quantity: number;
  min?: number;
  max?: number;
  onChange: (newQuantity: number) => void;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  min = 1,
  max = 99,
  onChange,
}) => {
  const handleDecrement = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      if (value >= min && value <= max) {
        onChange(value);
      } else if (value < min) {
        onChange(min);
      } else if (value > max) {
        onChange(max);
      }
    }
  };

  return (
    <div className="qty-selector">
      <button
        className="qty-btn"
        onClick={handleDecrement}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
      >
        <FiMinus />
      </button>
      <input
        type="number"
        className="qty-input"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
      />
      <button
        className="qty-btn"
        onClick={handleIncrement}
        disabled={quantity >= max}
        aria-label="Increase quantity"
      >
        <FiPlus />
      </button>
    </div>
  );
};

export default QuantitySelector;
