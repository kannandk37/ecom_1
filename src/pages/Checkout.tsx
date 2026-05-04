import { useState } from "react";
import CheckoutSidebar from "./CheckoutSideBar/CheckoutSideBar";
import OrderSummary from "./OrderSummary/OrderSummary";

import ShippingForm from "./Checkout/ShippingForm";
import PaymentForm from "./Checkout/PaymentForm";
import ReviewForm from "./Checkout/ReviewForm";
import { useNavigate } from "react-router-dom";
import { siteName } from "../utils/utils";
import Header from "./Header/Header";
import "./Checkout.css";
import IdentityForm from "./Checkout/IdentityForm";
// import { productsData } from "./CategoryProducts/categoryProducts";
import AddAddress from "./Address/AddAddress";
import { FaDollarSign } from "react-icons/fa";

const ConfirmCheckout = () => {
  const [currentStep, setCurrentStep] = useState<string>("identity");
  const [data, setData] = useState<any>();
  const navigate = useNavigate();
  const [isAddingAddress, setIsAddingAddress] = useState<boolean>(false);

  // Dynamic content logic
  const renderMiddleForm = () => {
    switch (currentStep) {
      case "identity":
        return <IdentityForm onNextStep={(data) => setData(data)} />;
      case "shipping":
        if (isAddingAddress) {
          return (
            <AddAddress
              onClickBack={() => setIsAddingAddress(false)}
              onSubmit={() => {
                setIsAddingAddress(false);
              }}
            />
          );
        }
        return (
          <ShippingForm
            onNext={(address) => {
              console.log("Shipping to:", address);
              setCurrentStep("payment"); // Move to next step
            }}
            onAddAddress={() => {
              console.log("Open Add Address Modal");
              setIsAddingAddress(true);
            }}
          />
        );
      case "payment":
        return <PaymentForm />;
      case "review":
      // return (
      // <ReviewForm
      //   shippingAddress={{
      //     type: "Home",
      //     name: "Tester",
      //     addressLine: "testing street",
      //     phone: "8989892344",
      //   }}
      //   paymentMethod={{
      //     name: "Cash on Delivery",
      //     icon: <FaDollarSign />,
      //     description: "Pay on door step",
      //   }}
      //   items={productsData}
      //   onPlaceOrder={() => { }}
      // />
      // );
      default:
        return <IdentityForm onNextStep={() => console.log("")} />;
    }
  };

  const getStepConfig = () => {
    const configs: Record<string, { btn: string; next: string }> = {
      identity: { btn: "Proceed to Shipping", next: "shipping" },
      shipping: { btn: "Proceed to Payment", next: "payment" },
      payment: { btn: "Review My Order", next: "review" },
      review: { btn: "Place Order Now", next: "complete" },
    };
    return configs[currentStep] || configs.identity;
  };

  const stepConfig = getStepConfig();

  return (
    <div className="checkout-page-root">
      <Header
        siteName={siteName}
        onSearch={() => console.log("search")}
        onSignInClick={() => navigate("/login")}
        onEnterpriseSignInClick={() => navigate("/enterprise.com")}
        onCartClick={() => navigate("/cart")}
        height="60px"
      />
      <div className="checkout-layout-grid">
        <CheckoutSidebar
          activeStep={currentStep}
          onStepChange={setCurrentStep}
        />

        <div className="checkout-middle-section">
          <div className="middle-content-scroll">{renderMiddleForm()}</div>
        </div>

        {/* <OrderSummary
          items={productsData}
          subtotal={1500}
          shipping={0}
          buttonText={stepConfig.btn}
          tax={10}
          onButtonClick={() => {
            stepConfig?.btn == "Place Order Now"
              ? navigate("/order-status")
              : setCurrentStep(stepConfig.next);
            setCurrentStep(stepConfig.next);
          }}
        /> */}
      </div>
    </div>
  );
};

export default ConfirmCheckout;
