import { useState } from "react";
import { useTheme } from "../../hooks/theme/useTheme";
import SalesExecutiveHeader from "./header/SalesExecutiveHeader";
import SalesExecutiveSidebar from "./sidebar/SalesExecutiveSidebar";
import SidebarToggle from "../uiComponents/button/SidebarToggle";

const SalesExecutiveLayout = ({ children, setActiveTab }) => {
  const { theme } = useTheme();

  // ✅ Single source of truth
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Floating Toggle */}
      <SidebarToggle
        collapsed={collapsed}
        toggle={() => setCollapsed((prev) => !prev)}
      />

      <div className="flex">
        {/* Sidebar */}
        <div className="max-h-screen sticky top-0">
          <SalesExecutiveSidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col w-full h-screen overflow-hidden">
          <SalesExecutiveHeader />
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

export default SalesExecutiveLayout;
