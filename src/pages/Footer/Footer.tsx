import React from "react";
import "./Footer.css";
import type { IconType } from "react-icons";

interface MenuProps {
  menuName: string;
  onClick: () => void;
}

interface SocialIconProps {
  iconName: string;
  iconImage: IconType;
  onClick: () => void;
}

interface FooterProps {
  menus?: MenuProps[];
  icons?: SocialIconProps[];
  copyRightText?: string;
  width?: string;
  height?: string;
}

const Footer: React.FC<FooterProps> = ({
  menus,
  icons,
  copyRightText,
  width,
  height,
}) => {
  return (
    <footer className="main-footer" style={{ width, minHeight: height }}>
      <div className="footer-container">
        {/* Left Section: Menu Links */}
        <div className="footer-section left">
          <ul className="footer-menu">
            {menus?.map((item, index) => (
              <li key={index} onClick={item.onClick} className="menu-item">
                {item.menuName}
              </li>
            ))}
          </ul>
        </div>

        {/* Middle Section: Social Media Icons */}
        <div className="footer-section middle">
          <div className="social-icons">
            {icons?.map((icon, index) => (
              //   <img
              //     key={index}
              //     // src={icon.iconImage}
              //     alt={icon.iconName}
              //     className="social-icon"
              //     onClick={icon.onClick}
              //   />
              <div
                className="social-placeholder"
                key={index}
                aria-label={icon.iconName}
                onClick={icon.onClick}
              >
                <icon.iconImage />
              </div>
            ))}
            {/* Fallback internal icons if no props provided to match screenshot */}
            {/* {icons.length === 0 && (
              <>
                <div className="social-placeholder">
                  <FaFacebook />
                </div>
                <div className="social-placeholder">
                  <FaInstagram />
                </div>
                <div className="social-placeholder">
                  <SiThreads />
                </div>
              </>
            )} */}
          </div>
        </div>

        {/* Right Section: Copyright */}
        <div className="footer-section right">
          <p className="copyright-text">{copyRightText}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
