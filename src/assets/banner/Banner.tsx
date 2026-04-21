import React from "react";
import "./Banner.css";
import Button from "../button/Button";

interface HomeBannerProps {
  // Image & Layout
  image: string;
  width?: string;
  height?: string;
  borderRadius?: string;

  // Text Content
  title1?: string; // Main heading (e.g., PREMIUM QUALITY)
  title2?: string; // Subheading (e.g., Discover our curated...)

  // Visibility Controls
  showTitle1?: boolean;
  showTitle2?: boolean;
  showButton?: boolean;

  // Button
  buttonText?: string;
  buttonVariant?: "primary" | "secondary" | "outline";
  buttonDisabled?: boolean;
  onButtonClick?: () => void;
  fontSize1?: string;
  fontSize2?: string;
}

const HomeBanner: React.FC<HomeBannerProps> = ({
  image,
  width,
  height,
  borderRadius,
  title1,
  title2,
  showTitle1,
  showTitle2,
  showButton,
  buttonText,
  buttonVariant,
  buttonDisabled,
  onButtonClick,
  fontSize1,
  fontSize2,
}) => {
  const containerStyle: React.CSSProperties = {
    backgroundImage: `url(${image})`,
    width: width,
    height: height,
    borderRadius: borderRadius,
  };

  const Title1Style: React.CSSProperties = {
    fontSize: fontSize1,
  };

  const Title2Style: React.CSSProperties = {
    fontSize: fontSize2,
  };

  return (
    <div className="home-banner-container" style={containerStyle}>
      <div className="home-banner-overlay">
        <div className="home-banner-content">
          {showTitle1 && (
            <h1 className="home-banner-title-main" style={Title1Style}>
              {title1}
            </h1>
          )}
          {showTitle2 && (
            <p className="home-banner-title-sub" style={Title2Style}>
              {title2}
            </p>
          )}

          {showButton && (
            <Button
              name={buttonText}
              variant={buttonVariant}
              disabled={buttonDisabled ? true : false}
              height="44px"
              width="160px"
              fontSize="22px"
              onClick={() => onButtonClick?.()}
            />
            // <button
            //   className={`home-banner-button ${buttonVariant}`}
            //   onClick={onButtonClick}
            //   disabled={buttonDisabled}
            // >
            //   {buttonText}
            // </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
