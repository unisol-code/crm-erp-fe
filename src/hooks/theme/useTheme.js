// themeUtils.js
import { themes } from "../../components/theme/Themes";
import { useRecoilState } from "recoil"
import { themeStateAtom } from "../../state/themeState/themeState"

export const useTheme = () => {
  const companyThemeMap = {
    UniSol: "UniSol",
    SurgiSol: "SurgiSol",
    "Enviro solution": "EnviroSolution",
    "Ignite Sphere": "IgniteSphere",
    Home: "Home",
  };
  const [theme, setTheme] = useRecoilState(themeStateAtom);

  const switchTheme = (company) => {
    console.log(theme);
    const themeKey = companyThemeMap[company];
    setTheme(themes[themeKey]);
  };

  return { theme, switchTheme };
};
