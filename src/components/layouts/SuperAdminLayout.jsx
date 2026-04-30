import { useState } from "react";
import SuperAdminHeader from "./header/SuperAdminHeader";
import SuperAdminSidebar from "./sidebar/SuperAdminSidebar";
import SidebarToggle from "../uiComponents/button/SidebarToggle";
import { useTheme } from "../../hooks/theme/useTheme";

const HrLayout = ({ children, setActiveTab }) => {
  const { theme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Floating Toggle */}
      <SidebarToggle
        collapsed={collapsed}
        toggle={() => setCollapsed((p) => !p)}
      />

      <div className="flex">
        {/* Sidebar */}
        <div className="max-h-screen sticky top-0">
          <SuperAdminSidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col w-full h-screen overflow-hidden">
          <SuperAdminHeader />
          <div
            style={{ backgroundColor: theme?.backgroundColor }}
            className="px-4 py-4 w-full overflow-y-scroll flex-1"
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default HrLayout;
