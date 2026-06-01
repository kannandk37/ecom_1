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
        <div className="footer-section left">
          <ul className="footer-menu">
            {menus?.map((item, index) => (
              <li key={index} onClick={item.onClick} className="menu-item">
                {item.menuName}
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-section middle">
          <div className="social-icons">
            {icons?.map((icon, index) => (
              <div
                className="social-placeholder"
                key={index}
                aria-label={icon.iconName}
                onClick={icon.onClick}
              >
                <icon.iconImage />
              </div>
            ))}
          </div>
        </div>
        <div className="footer-section right">
          <p className="copyright-text">{copyRightText}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
