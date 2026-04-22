import React, { useRef } from "react";
import "../OrderReceipt.css";
import downloadReceiptAsPdf from "../../../utils/utils";
import DRY_FRUITS from "../../../../data/DRY_FRUITS.png";
import DATES from "../../../../data/DATES.png";
import NUTS from "../../../../data/NUTS.png";
import { FaArrowLeftLong } from "react-icons/fa6";
import OrderReceipt from "../OrderReceipt";
import Button from "../../../assets/button/Button";
import { useNavigate } from "react-router-dom";

const DemoReceiptScreen: React.FC = () => {
  // Ref to target the receipt paper for download
  const receiptRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Mock data to match the image
  const receiptData = {
    orderNumber: "#DF-98231",
    date: "Oct 24, 2024",
    status: "PAID & DELIVERED",
    shipping: {
      name: "Rahul Sharma",
      phone: "+91 98765 43210",
      address: [
        "Apt 402, Green Valley Residency,",
        "HSR Layout Sector 2, Near BDA Complex,",
        "Bengaluru, KA - 560102",
      ],
    },
    payment: {
      method: {
        icon: "https://img.icons8.com/fluency/48/000000/google-pay.png", // Or use a local SVG
        text: "Google Pay",
      },
      transactionId: "TXN-7729194423",
    },
    items: [
      {
        id: "1",
        image: DRY_FRUITS, // Product images
        name: "Mamra Almonds",
        details: "500G POUCH × 2",
        price: "₹2,450",
      },
      {
        id: "2",
        image: DATES,
        name: "Medjool Dates",
        details: "250G BOX × 1",
        price: "₹850",
      },
      {
        id: "3",
        image: NUTS,
        name: "Roasted Pistachios",
        details: "200G JAR × 3",
        price: "₹1,350",
      },
    ],
    pricing: {
      subtotal: "₹4,650.00",
      discount: {
        code: "FESTIVE-10",
        value: "- ₹465.00",
      },
      shippingFee: "₹40.00",
      grandTotal: "₹4,225.00",
    },
  };

  const handleDownloadCopy = async () => {
    // Generate PDF using the captured receipt container ref
    // The utility function will handle cloning to remove the button
    await downloadReceiptAsPdf(
      receiptRef as any,
      `OrderReceipt-${receiptData.orderNumber}.pdf`,
    );
  };

  return (
    <div className="receipt-screen-container">
      {/* Back Button outside the receipt paper */}
      <div className="screen-header">
        <Button
          disabled={false}
          name={"Back"}
          icon={<FaArrowLeftLong />}
          onClick={() => navigate("/")}
          fontSize={"15px"}
        />
        <span className="button-arrow"></span>{" "}
      </div>

      {/* The reusable component, wrapped in a div with a ref for download */}
      <div ref={receiptRef} className="receipt-paper-wrapper">
        <OrderReceipt {...receiptData} onDownloadCopy={handleDownloadCopy} />
      </div>
    </div>
  );
};

export default DemoReceiptScreen;
