import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./pages/Header/Header.tsx";
import "./assets/color/colors.css";
import Footer from "./pages/Footer/Footer.tsx";
import type { IconType } from "react-icons";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";
import "./MainLayout.css";
import { siteName } from "./utils/utils.ts";

interface MenuProps {
  menuName: string;
  onClick: () => void;
}

let FooterMenus: MenuProps[] = [
  { menuName: "Home", onClick: () => console.log("Home clicked") },
  { menuName: "About Us", onClick: () => console.log("About clicked") },
  { menuName: "Services", onClick: () => console.log("Services clicked") },
  { menuName: "Contact", onClick: () => console.log("Contact clicked") },
];

interface SocialIconProps {
  iconName: string;
  iconImage: IconType;
  onClick: () => void;
}

let FooterIcons: SocialIconProps[] = [
  {
    iconName: "FaceBook",
    iconImage: FaFacebook,
    onClick: () => console.log("facebook"),
  },
  {
    iconName: "Instagram",
    iconImage: FaInstagram,
    onClick: () => console.log("Instagram"),
  },
  {
    iconName: "Threads",
    iconImage: SiThreads,
    onClick: () => console.log("Threads"),
  },
];

let copyRightText: string = `© 2025 The Nature's Candy & Co.`;

const MainLayout: React.FC = () => {
  return (
    <>
      <Header
        siteName={siteName}
        onSearch={() => console.log("search")}
        onSignInClick={() => console.log("sign in")}
        onCartClick={() => console.log("cart click")}
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
