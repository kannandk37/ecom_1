import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./pages/Header/Header";
import "./assets/color/colors.css";
import Footer from "./pages/Footer/Footer";
import type { IconType } from "react-icons";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";
import "./MainLayout.css";
import { siteName } from "./utils/utils";

interface MenuProps {
  menuName: string;
  onClick: () => void;
}

interface SocialIconProps {
  iconName: string;
  iconImage: IconType;
  onClick: () => void;
}

let copyRightText: string = `© 2025 The Nature's Candy & Co.`;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();

  const FooterIcons: SocialIconProps[] = [
    {
      iconName: "FaceBook",
      iconImage: FaFacebook,
      onClick: () =>
        window.open(
          "https://www.facebook.com/yourprofile",
          "_blank",
          "noopener,noreferrer",
        ),
    },
    {
      iconName: "Instagram",
      iconImage: FaInstagram,
      onClick: () =>
        window.open(
          "https://www.instagram.com/naturescandy_py",
          "_blank",
          "noopener,noreferrer",
        ),
    },
    {
      iconName: "Threads",
      iconImage: SiThreads,
      onClick: () =>
        window.open(
          "https://www.threads.net/@yourprofile",
          "_blank",
          "noopener,noreferrer",
        ),
    },
  ];

  let FooterMenus: MenuProps[] = [
    { menuName: "Home", onClick: () => navigate("/") },
    { menuName: "About Us", onClick: () => console.log("About clicked") },
    { menuName: "Contact", onClick: () => console.log("Contact clicked") },
  ];
  return (
    <>
      <Header
        siteName={siteName}
        onSearch={() => console.log("search")}
        onSignInClick={() => navigate("/login")}
        onEnterpriseSignInClick={() => navigate("/enterprise.com")}
        onCartClick={() => navigate("/cart")}
      />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer
        menus={FooterMenus}
        icons={FooterIcons}
        copyRightText={copyRightText}
        width="100%"
        height="10px"
      />
    </>
  );
};

export default MainLayout;
