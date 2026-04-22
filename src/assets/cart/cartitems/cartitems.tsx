import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
// Import your existing Quantity component here
import QuantitySelector from "../../quantitySelector/QuantitySelector";
import "./CartItems.css";

export type CartItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  quantity: number;
};

export interface CartItemsProps {
  data: CartItem | CartItem[];
  width?: string;
  height?: string;
  onRemove?: (id: string) => void;
}

const CartItems: React.FC<CartItemsProps> = ({
  data,
  width = "100%",
  height = "auto",
  onRemove,
}) => {
  const items = Array.isArray(data) ? data : [data];

  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  const toggleSaveForLater = (id: string) => {
    setSavedItems((prev) => {
      const newSaved = new Set(prev);
      if (newSaved.has(id)) {
        newSaved.delete(id);
      } else {
        newSaved.add(id);
      }
      return newSaved;
    });
  };

  return (
    <div
      className="cart-items-container"
      style={{
        width,
        height,
        overflowY: height !== "auto" ? "auto" : "visible",
      }}
    >
      {items.map((item, index) => {
        const isSaved = savedItems.has(item.id);

        return (
          <div
            key={item.id}
            className={`cart-item-card ${index !== items.length - 1 ? "border-bottom" : ""}`}
          >
            <div className="cart-item-image-wrapper">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="cart-item-image"
              />
            </div>

            <div className="cart-item-content">
              <div className="cart-item-header">
                <div className="title-desc">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-desc">{item.description}</p>
                </div>
                <div className="cart-item-price">₹{item.price}</div>
              </div>

              <div className="cart-item-actions-row">
                <div className="quantity-wrapper">
                  <QuantitySelector
                    quantity={item.quantity}
                    onChange={(newVal: number) =>
                      console.log("Update qty:", newVal)
                    }
                  />
                </div>

                <div className="text-action-buttons">
                  <button
                    className={`text-btn save-btn ${isSaved ? "saved" : ""}`}
                    onClick={() => toggleSaveForLater(item.id)}
                  >
                    {isSaved ? (
                      <FaHeart className="heart-icon filled" />
                    ) : (
                      <FaRegHeart className="heart-icon outline" />
                    )}
                    <span>Save for later</span>
                  </button>

                  <div className="action-divider"></div>

                  <button
                    className="text-btn remove-btn"
                    onClick={() => onRemove && onRemove(item.id)}
                  >
                    <FiTrash2 className="trash-icon" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartItems;
