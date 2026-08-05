// // data/theme.js

// import surgisolLogoImage from "../../assets/images/surgisol.svg";

// export const THEME = {
//   primaryColor: "#C6693C",      // Deep warm peach
//   secondaryColor: "#FFE0B2",    // Soft light peach
//   bgSidebar: "#E8B59F",
//   backgroundColor: "#FBE9E7",   // Very light peach tint for main background
//   highlightColor: "#FFC4A2",    // Highlight for hovers/selections
//   accentColor: "#A54A29",       // Deep terracotta for buttons/CTA
//   logoImage: surgisolLogoImage,
// };

// export const themeColors = {
//   primary: "#C6693C",
//   primaryLight: "#FFE0B2",
//   primaryDark: "#A54A29",
//   primaryBg: "#FBE9E7",
//   primaryHover: "#FFC4A2",
//   sidebarBg: "#E8B59F",
// };

// data/theme.js

export const THEME = {
  primaryColor: "var(--theme-primary)",
  secondaryColor: "var(--theme-secondary)",
  bgSidebar: "var(--theme-bg-sidebar)",
  backgroundColor: "var(--theme-background)",
  highlightColor: "var(--theme-highlight)",
  accentColor: "var(--theme-accent)",
};

export const themeColors = {
  primary: "var(--theme-primary)",
  primaryLight: "var(--theme-secondary)",
  primaryDark: "var(--theme-accent)",
  primaryBg: "var(--theme-background)",
  primaryHover: "var(--theme-highlight)",
  sidebarBg: "var(--theme-bg-sidebar)",
};