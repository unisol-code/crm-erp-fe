import { createPortal } from "react-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useTheme } from "../../../hooks/theme/useTheme";

const SidebarToggle = ({ collapsed, toggle }) => {
  const { theme } = useTheme();

  return createPortal(
    <div
      onClick={toggle}
      style={{
        position: "fixed",
        top: "24px",
        left: "290px", // ⬅ fixed anchor
        transform: collapsed
          ? "translateX(-212px)" // 300 - 88
          : "translateX(0)",
        backgroundColor: theme?.primaryColor,
      }}
      className="
        w-6 h-6 rounded-full
        flex items-center justify-center
        cursor-pointer
        z-[99999]
        border border-white/40
        transition-transform duration-150 ease-out
      "
    >
      {collapsed ? (
        <IoIosArrowForward className="text-white" />
      ) : (
        <IoIosArrowBack className="text-white" />
      )}
    </div>,
    document.body
  );
};

export default SidebarToggle;
