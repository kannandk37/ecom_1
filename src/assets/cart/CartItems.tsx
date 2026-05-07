import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import QuantitySelector from "../quantitySelector/QuantitySelector";
import "./CartItems.css";
import { CartItem } from "../../entity/cart_item";
import NUTS from "../../../data/NUTS.png";
import { CartItemService } from "../../service/cart_item";
export interface CartItemsProps {
  data: CartItem[];
  width?: string;
  height?: string;
  onIncreaseQuantity?: (cartItem: CartItem) => Promise<void> | void;
  onRemove?: (cartItem: CartItem) => Promise<void> | void;
  onSaveForLater?: (cartItem: CartItem) => Promise<void> | void;
}

const CartItems: React.FC<CartItemsProps> = ({
  data,
  width = "100%",
  height = "auto",
  onIncreaseQuantity,
  onRemove,
  onSaveForLater,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  // const toggleSaveForLater = (id: string) => {
  //   setSavedItems((prev) => {
  //     const newSaved = new Set(prev);
  //     if (newSaved.has(id)) {
  //       newSaved.delete(id);
  //     } else {
  //       newSaved.add(id);
  //     }
  //     return newSaved;
  //   });
  // };

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
                src={item.product.images ? item.product.images[0] : NUTS}
                alt={item.product.name}
                className="cart-item-image"
              />
            </div>

            <div className="cart-item-content">
              <div className="cart-item-header">
                <div className="title-desc">
                  <h3 className="cart-item-name">{item.product.name}</h3>
                  <p className="cart-item-desc">
                    {item.product.shortDescription}
                  </p>
                </div>
                <div className="cart-item-price">₹{item.product.price}</div>
              </div>

              <div className="cart-item-actions-row">
                <div className="quantity-wrapper">
                  <QuantitySelector
                    quantity={item.quantity}
                    onChange={(value: number) => {
                      item.quantity = value;
                      onIncreaseQuantity(item);
                    }}
                  />
                </div>

                <div className="text-action-buttons">
                  <button
                    className={`text-btn save-btn 
                      `}
                    // ${isSaved ? "saved" : ""}
                    onClick={() => onSaveForLater(item)}
                  >
                    <FaRegHeart className="heart-icon outline" />
                    {/* {isSaved ? (
                      <FaHeart className="heart-icon filled" />
                    ) : (
                    )} */}
                    <span>Save for later</span>
                  </button>

                  <div className="action-divider"></div>

                  <button
                    className="text-btn remove-btn"
                    onClick={() => onRemove && onRemove(item)}
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
