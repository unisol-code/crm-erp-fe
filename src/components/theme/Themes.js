import unisolLogoImage from "../../assets/images/unisolservices.svg";
import surgisolLogoImage from "../../assets/images/surgisol.svg";
import envirosolLogoImage from "../../assets/images/backgroundenviroSolutions.svg";
import igniteSphereLogoImage from "../../assets/images/igniteSphere.svg";

export const themes = {
  UniSol: {
    primaryColor: "#4FA8E5",  // Sky blue (requested)
    secondaryColor: "#89CFF0", // Unique light blue
    bgSidebar: "#D3EDFD",     // Unique pale blue
    backgroundColor: "#E7F5FF", // Unique whitish-blue
    highlightColor: "#A7D8FF", // Unique azure
    accentColor: "#1C5CD6",    // Unique navy
    logoImage: unisolLogoImage,
  },
  IgniteSphere: {
    primaryColor: "#9683EC",   // Primary indigo
    secondaryColor: "#D6D8FB", // Light indigo
    bgSidebar: "#E0E7FF",        // Indigo-100 (light sidebar)
    backgroundColor: "#F5F7FF",  // Custom pale indigo-tinted white
    highlightColor: "#B39AFF",  // Indigo 100 (lighter shade)
    accentColor: "#6366F1",     // Indigo 400 (lighter shade of dark indigo)
    logoImage: igniteSphereLogoImage,
  },

  EnviroSolution: {
    primaryColor: "#4A7E4C",   // Unique sage green (dark color)
    secondaryColor: "#BBDBC0", // Unique pale green
    bgSidebar: "#DBE3D3",      // Unique gray-green
    backgroundColor: "#F0FCE4", // Unique mint
    highlightColor: "#cae3caff",  // Lighter shade for highlight (light color)
    accentColor: "#2D5D39",     // Unique deep green
    logoImage: envirosolLogoImage,
  },
  SurgiSol: {
    primaryColor: "#C6693C",      // Deep warm peach
    secondaryColor: "#FFE0B2",    // Soft light peach
    bgSidebar: "#E8B59F",
    backgroundColor: "#FBE9E7",   // Very light peach tint for main background
    highlightColor: "#FFC4A2",    // Highlight for hovers/selections
    accentColor: "#A54A29",       // Deep terracotta for buttons/CTA
    logoImage: surgisolLogoImage,
  },
  Home: {
    primaryColor: "#4FA8E5",  // Sky blue (requested)
    secondaryColor: "#89CFF0", // Unique light blue
    bgSidebar: "#D3EDFD",     // Unique pale blue
    backgroundColor: "#E7F5FF", // Unique whitish-blue
    highlightColor: "#A7D8FF", // Unique azure
    accentColor: "#1C5CD6",    // Unique navy
    logoImage: unisolLogoImage,
  }
};
