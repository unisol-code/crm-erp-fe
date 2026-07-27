import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../hooks/theme/useTheme";
import { CalendarCheck, LayoutDashboard } from "lucide-react";
import { IoPeopleCircleOutline } from "react-icons/io5";
import { Info } from "lucide-react";
import contactUs from "../../../assets/images/contactUs.png";
import { useLocation } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import SubMenuItem from "./SubMenuItem";
import { Database } from "lucide-react";
import { ChartColumnBig } from "lucide-react";
import CRM from "../../../assets/images/crm 2.png";
import Custom from "../../../assets/custom.png";
import { useSetRecoilState } from "recoil";
import { userAuthState } from "../../../state/authenticatedState/authenticatedState";
import { useSignIn } from "../../../hooks/auth/useSignIn";

function Sidebar({ collapsed, setCollapsed }) {
  const { theme } = useTheme();
  const [expandedItems, setExpandedItems] = useState([]);
  const [logoutClicked, setLogoutClicked] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const setUserInfo = useSetRecoilState(userAuthState);
  const { resetSuperAdmin, resetEmployee } = useSignIn();

  const SidebarItems = [
    {
      id: 1,
      icon: <LayoutDashboard className="w-6 h-6" />,
      name: "Dashboard",
      path: "/crm-dashboard",
    },
    {
      id: 2,
      icon: <IoPeopleCircleOutline className="w-6 h-6" />,
      name: "Lead Management",
      hasSubMenu: true,
      subItems: [
        { id: 21, name: "Create Lead", path: "/lead/createlead" },
        { id: 22, name: "Manage Lead", path: "/lead/lead-tracking" },
        { id: 23, name: "View Lead", path: "/lead/view-lead" },
      ],
    },
    {
      id: 3,
      icon: <Database className="w-6 h-6" />,
      name: "Database",
      path: "/database",
    }, {
      id: 5,
      icon: <CalendarCheck className="w-6 h-6" />,
      name: "Customer Visit Plan",
      hasSubMenu: true,
      subItems: [
        {
          id: 31,
          name: "Monthly Planning",
          path: "/admin/sales-executive/employee-list",
        },
        // { id: 32, name: "Target Sheet",
        //   //  path: "/sales-executive/target-sheet"
        //    },
        // {
        //   id: 33,
        //   name: "Territory Snapshot",
        //   // path: "/admin/sales-executive/territory-snapshot",
        // },
      ],
    },
    {
      id: 4,
      icon: <ChartColumnBig className="w-6 h-6" />,
      name: "Sales",
      hasSubMenu: true,
      subItems: [{ id: 41, name: "Sales Analytics", path: "/sales-analytics" }],
    },
     {
      id: 6,
      icon: <ChartColumnBig className="w-6 h-6" />,
      name: "Analytics",
      path: "/sales-analyticsAll", 

    },
  ];

  const handleToggle = (id, subItems = [], parentPath = []) => {
    setExpandedItems((prev) => {
      const isAlreadyOpen = prev.includes(id);
      const newPath = [...parentPath, id];
      if (isAlreadyOpen) {
        const index = prev.indexOf(id);
        return prev.slice(0, index);
      } else {
        if (subItems.length > 0) {
          navigate(subItems[0].path);
        }
        return newPath;
      }
    });
  };

  const renderSubItems = (subItems) => (
    <ul className="transition-all duration-300 ease-in-out">
      {subItems.map((sub, index) => (
        <SubMenuItem
          key={sub.id}
          sub={sub}
          index={index}
          subItems={subItems}
          subExpanded={expandedItems.includes(sub.id)}
          collapsed={collapsed}
          handleToggle={handleToggle}
          item={sub}
          pathname={pathname}
        />
      ))}
    </ul>
  );

  useEffect(() => {
    const handleResize = () => setCollapsed(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    setLogoutClicked(true);
    setTimeout(() => {
      sessionStorage.clear();
      localStorage.clear();
      setUserInfo({ isAuthenticated: false });
      resetSuperAdmin();
      resetEmployee();
      navigate("/");
    }, 200);
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary-color",
      theme.primaryColor
    );
    document.documentElement.style.setProperty(
      "--highlight-color",
      theme.highlightColor
    );
  }, [theme]);

  return (
    <div
      className={`relative ${collapsed ? "w-[88px]" : "w-[300px]"} 
  h-full overflow-y-auto scrollbar-hide flex justify-between flex-col gap-7 pt-4`}
      style={{ backgroundColor: theme?.bgSidebar }}
    >
      <div className="flex flex-col flex-1 px-1">
        <div className="flex items-center justify-center w-full pb-6">
          <img
            className="max-w-[272px] w-full h-auto object-contain"
            src={theme?.logoImage}
            alt="logo"
          />
        </div>
        <div className={`flex items-center w-full gap-2 justify-center`}>
          {/* CRM Icon */}
          <div className="flex items-center justify-center w-10 h-10 shrink-0">
            <img
              src={CRM}
              alt="CRM System"
              className="object-contain w-full h-full"
            />
          </div>

          {/* Customer Icon */}
          <div className="flex items-center justify-center h-10">
            <img
              src={Custom}
              alt="Customer Management"
              className="object-contain h-full"
            />
          </div>
        </div>

        <div className="flex flex-col w-full gap-4 px-2 py-4">
          {SidebarItems?.map((item) => {
            const isExpanded = expandedItems.includes(item.id);
            const checkActive = (subs) =>
              subs?.some(
                (sub) =>
                  sub.path === pathname ||
                  pathname.startsWith(`${sub.path}/`) ||
                  checkActive(sub.subItems)
              );
            const isMainActive = checkActive(item.subItems);

            return (
              <SidebarItem
                key={item.id}
                item={item}
                collapsed={collapsed}
                isExpanded={isExpanded}
                isMainActive={isMainActive}
                handleToggle={handleToggle}
                renderSubItems={renderSubItems}
                theme={theme}
                pathname={pathname}
                setExpandedItems={setExpandedItems}
              />
            );
          })}
        </div>
      </div>

      <div
        className={`flex flex-col w-full gap-4 px-4 ${collapsed ? "items-center" : "items-start"
          }`}
      >
        <p className="cursor-pointer font-medium flex text-[#7C8DB5] gap-2 items-start">
          <Info className="w-6 h-6" />
          {!collapsed && "Help Center"}
        </p>
        <p className="cursor-pointer font-medium flex text-[#7C8DB5] gap-2 items-start">
          <img src={contactUs} alt="Contact Us" className="w-6 h-6" />
          {!collapsed && "Contact Us"}
        </p>
      </div>

      <div
        onClick={handleLogout}
        className="sticky bottom-0 flex items-center w-full pt-2 pb-2 border-t-4"
        style={{ backgroundColor: "white", borderColor: theme?.highlightColor }}
      >
        <div
          className={`flex items-center gap-3 p-2 mx-4 rounded-lg w-full shadow-sm transition-all duration-300 cursor-pointer
         ${logoutClicked
              ? "bg-white text-black shadow-xl"
              : "bg-[var(--primary-color)] text-white hover:bg-[var(--highlight-color)] hover:text-black"
            }
         ${collapsed ? "justify-center" : "justify-start"}
       `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-box-arrow-right"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
            />
            <path
              fillRule="evenodd"
              d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
            />
          </svg>
          {!collapsed && (
            <p className="flex items-start gap-2 font-medium">Log out</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
