import React from "react";
import "./CartItems.css";

// Type definition for a single cart item based on reference image data
export type CartItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  quantity: number;
};

// Props definition for the CartItems component
export interface CartItemsProps {
  data: CartItem | CartItem[]; // Accept a single item or an array of items
  width?: string; // Optional width prop (e.g., "50%", "400px")
  height?: string; // Optional height prop (e.g., "300px", "50vh")
}

// **INTEGRATION NOTE:** User should replace this dummy with their actual QuantityIncrement component.
// The dummy is for illustration and data flow demonstration.
interface DummyQuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const DummyQuantitySelector: React.FC<DummyQuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
}) => {
  return (
    <div className="cart-items-dummy-quantity-selector">
      <button onClick={() => onQuantityChange(quantity > 1 ? quantity - 1 : 1)}>
        -
      </button>
      <span className="cart-items-dummy-quantity-display">{quantity}</span>
      <button onClick={() => onQuantityChange(quantity + 1)}>+</button>
    </div>
  );
};

// Helper component for a single cart item card view to keep main logic cleaner
const SingleItemCard: React.FC<{ item: CartItem }> = ({ item }) => {
  // Use user's real QuantitySelector component here.
  // We'll use the dummy for this illustration.
  const handleQuantityChange = (newQuantity: number) => {
    // Implement quantity update logic here (e.g., dispatch an action, update state)
    console.log(
      `Updated quantity for ${item.name} (id: ${item.id}) to ${newQuantity}`,
    );
  };

  return (
    <div className="cart-items-item-card">
      <div className="cart-items-image-column">
        {/* The item image is presented within a styled black fill container */}
        <div className="cart-items-image-block">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="cart-items-item-image"
          />
        </div>
      </div>
      <div className="cart-items-details-column">
        <div className="cart-items-upper-details-row">
          <div className="cart-items-text-group">
            <h3 className="cart-items-item-name">{item.name}</h3>
            <p className="cart-items-item-description">{item.description}</p>
          </div>
          <div className="cart-items-price-group">
            <p className="cart-items-item-price">{item.price}</p>
          </div>
        </div>
        <div className="cart-items-lower-details-row">
          <div className="cart-items-quantity-group">
            {/* **INTEGRATION:** User plugs in their real QuantitySelector component here */}
            <DummyQuantitySelector
              quantity={item.quantity}
              onQuantityChange={handleQuantityChange}
            />
          </div>
          <div className="cart-items-actions-group">
            <button className="cart-items-action-button cart-items-remove-button">
              <span className="cart-items-action-icon">🗑️</span> Remove
            </button>
            <button className="cart-items-action-button cart-items-save-button">
              <span className="cart-items-action-icon">❤️</span> Save for Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartItems: React.FC<CartItemsProps> = ({
  data,
  width = "100%",
  height,
}) => {
  // Normalize data into an array for consistent rendering logic
  const items = Array.isArray(data) ? data : [data];

  return (
    <div
      className="cart-items-main-container"
      style={{
        width: width, // Applies dynamic width prop
        height: height, // Applies dynamic height prop
        fontFamily: "var(--font-family)", // Explicitly sets the font family
      }}
    >
      {items.map((item) => (
        <SingleItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default CartItems;
