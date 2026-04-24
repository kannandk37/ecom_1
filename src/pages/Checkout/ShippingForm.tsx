import React, { useState } from "react";
import { FiPlus, FiMapPin, FiPhone } from "react-icons/fi";
import DashboardButton from "../../assets/ui/DashBoardButton/DashBoardButton"; // Reusing your Button
import "./ShippingForm.css";
import { FaMapMarkerAlt } from "react-icons/fa";

interface Address {
  id: string;
  type: string; // Home, Office, etc.
  name: string;
  addressLine: string;
  phone: string;
}

const MOCK_ADDRESSES: Address[] = [
  {
    id: "1",
    type: "Home",
    name: "Rahul Sharma",
    addressLine:
      "402, Heritage Residency, JP Nagar 7th Phase, Bangalore, Karnataka - 560078",
    phone: "+91 98765 43210",
  },
  {
    id: "2",
    type: "Office",
    name: "Rahul Sharma",
    addressLine:
      "Tech Park West, Level 12, Whitefield Main Road, Bangalore, Karnataka - 560066",
    phone: "+91 98765 43210",
  },
  {
    id: "3",
    type: "Office",
    name: "Rahul Sharma",
    addressLine:
      "Tech Park West, Level 12, Whitefield Main Road, Bangalore, Karnataka - 560066",
    phone: "+91 98765 43210",
  },
  {
    id: "4",
    type: "Office",
    name: "Rahul Sharma",
    addressLine:
      "Tech Park West, Level 12, Whitefield Main Road, Bangalore, Karnataka - 560066",
    phone: "+91 98765 43210",
  },
  {
    id: "5",
    type: "Home",
    name: "Rahul Sharma",
    addressLine:
      "402, Heritage Residency, JP Nagar 7th Phase, Bangalore, Karnataka - 560078",
    phone: "+91 98765 43210",
  },
  {
    id: "6",
    type: "Office",
    name: "Rahul Sharma",
    addressLine:
      "Tech Park West, Level 12, Whitefield Main Road, Bangalore, Karnataka - 560066",
    phone: "+91 98765 43210",
  },
  {
    id: "7",
    type: "Office",
    name: "Rahul Sharma",
    addressLine:
      "Tech Park West, Level 12, Whitefield Main Road, Bangalore, Karnataka - 560066",
    phone: "+91 98765 43210",
  },
  {
    id: "8",
    type: "Office",
    name: "Rahul Sharma",
    addressLine:
      "Tech Park West, Level 12, Whitefield Main Road, Bangalore, Karnataka - 560066",
    phone: "+91 98765 43210",
  },
  {
    id: "9",
    type: "Home",
    name: "Rahul Sharma",
    addressLine:
      "402, Heritage Residency, JP Nagar 7th Phase, Bangalore, Karnataka - 560078",
    phone: "+91 98765 43210",
  },
  {
    id: "10",
    type: "Office",
    name: "Rahul Sharma",
    addressLine:
      "Tech Park West, Level 12, Whitefield Main Road, Bangalore, Karnataka - 560066",
    phone: "+91 98765 43210",
  },
  {
    id: "11",
    type: "Office",
    name: "Rahul Sharma",
    addressLine:
      "Tech Park West, Level 12, Whitefield Main Road, Bangalore, Karnataka - 560066",
    phone: "+91 98765 43210",
  },
  {
    id: "12",
    type: "Office",
    name: "Rahul Sharma",
    addressLine:
      "Tech Park West, Level 12, Whitefield Main Road, Bangalore, Karnataka - 560066",
    phone: "+91 98765 43210",
  },
  {
    id: "13",
    type: "Home",
    name: "Rahul Sharma",
    addressLine:
      "402, Heritage Residency, JP Nagar 7th Phase, Bangalore, Karnataka - 560078",
    phone: "+91 98765 43210",
  },
  {
    id: "14",
    type: "Office",
    name: "Rahul Sharma",
    addressLine:
      "Tech Park West, Level 12, Whitefield Main Road, Bangalore, Karnataka - 560066",
    phone: "+91 98765 43210",
  },
  {
    id: "15",
    type: "Office",
    name: "Rahul Sharma",
    addressLine:
      "Tech Park West, Level 12, Whitefield Main Road, Bangalore, Karnataka - 560066",
    phone: "+91 98765 43210",
  },
  {
    id: "16",
    type: "Office",
    name: "Rahul Sharma",
    addressLine:
      "Tech Park West, Level 12, Whitefield Main Road, Bangalore, Karnataka - 560066",
    phone: "+91 98765 43210",
  },
];

interface ShippingFormProps {
  onNext: (selectedAddress: Address) => void;
  onAddAddress?: () => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({
  onNext,
  onAddAddress,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => setSelectedId(id);

  const handleNextSubmit = () => {
    const selected = MOCK_ADDRESSES.find((a) => a.id === selectedId);
    if (selected) onNext(selected);
  };

  return (
    <div className="shipping-form-container">
      <div className="shipping-header">
        <div className="section-header">
          <span className="step-tag">Step 02 of 4</span>
          <h2 className="section-title">Shipping Address</h2>
        </div>
        <button className="add-address-btn" onClick={onAddAddress}>
          <FiPlus /> Add New Address
        </button>
      </div>

      <div className="address-list-scroll">
        <div className="address-grid">
          {MOCK_ADDRESSES.map((addr) => (
            <div
              key={addr.id}
              className={`address-card ${selectedId === addr.id ? "selected" : ""}`}
              onClick={() => setSelectedId(addr.id)}
            >
              <div className="card-top">
                <span className="address-type">{addr.type}</span>
                <div className="custom-radio">
                  <div
                    className={`radio-inner ${selectedId === addr.id ? "checked" : ""}`}
                  />
                </div>
              </div>
              <div className="card-body">
                <p className="user-name">{addr.name}</p>
                <p className="address-text"><FaMapMarkerAlt size={14}/>  {addr.addressLine}</p>
                <div className="phone-row">
                  <FiPhone size={14} />
                  <span>{addr.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="shipping-actions">
        <DashboardButton
          name="Next"
          variant="primary"
          disabled={!selectedId}
          onClick={handleNextSubmit}
          width="220px"
        />
      </div> 
    </div>
  );
};

export default ShippingForm;
