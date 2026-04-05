import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/src/assets/ui/SideBar/SideBar";
import "./DashboardLayout.css";

export const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`dashboard-container ${isCollapsed ? "sidebar-min" : "sidebar-max"}`}
    >
      <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      <main className="dashboard-content">
        <div className="content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
